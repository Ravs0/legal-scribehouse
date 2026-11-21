import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Archive, ArrowLeft, Eye, Plus, Send, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { readingMinutes, renderArticle, slugify } from '@/lib/markdown';
import { TYPE_META } from '@/lib/insights';
import { can } from '../access';
import { repo } from '../data';
import { MARKET_CODES, MARKET_NAME, type Article, type ContentStatus, type ContentType } from '../types';
import { ARTICLE_LABEL, ArticleBadge, Empty, Field, fmtAgo, NativeSelect, PageHead, Panel, useAction, useMe, usePeople } from '../components/kit';

export const ARTICLE_CATEGORIES = ['Market entry', 'Contracts', 'Customs & FTAs', 'Product registration', 'Trademarks & IP', 'Disputes & payment risk'];
const TYPES: ContentType[] = ['guide', 'briefing', 'post', 'case', 'statute'];

export const ArticleList = () => {
  const me = useMe();
  const people = usePeople();
  const nav = useNavigate();
  const act = useAction();
  const list = useQuery({ queryKey: ['articles'], queryFn: () => repo.listArticles() });
  const [status, setStatus] = useState<'' | ContentStatus>('');
  const rows = (list.data ?? []).filter((a) => !status || a.status === status);

  const create = async () => {
    const a = await act(() => repo.saveArticle({ title: 'Untitled article', type: 'guide', content: '', summary: '' }));
    if (a) nav(`/workspace/articles/${a.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Articles"
        sub={can.publishArticles(me) ? 'Write, review and publish insights for the public site.' : 'Write drafts and submit them for a partner to publish.'}
        actions={<Button icon="leading" onClick={create}><Plus /> New article</Button>}
      />
      <div className="flex flex-wrap gap-1.5">
        {(['', 'draft', 'in_review', 'published', 'archived'] as const).map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)} aria-pressed={status === s}
            className={cn('type-label-md h-8 rounded-full px-3', status === s ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground')}>
            {s ? ARTICLE_LABEL[s] : 'All'} <span className="tabular opacity-70">{s ? (list.data ?? []).filter((a) => a.status === s).length : (list.data ?? []).length}</span>
          </button>
        ))}
      </div>
      <Panel>
        {rows.length === 0 ? <Empty>No articles here.</Empty> : (
          <ul className="divide-y divide-border">
            {rows.map((a) => (
              <li key={a.id}>
                <Link to={`/workspace/articles/${a.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-foreground/[0.03]">
                  <span className="min-w-0 flex-1">
                    <span className="type-label-lg block truncate">{a.title}</span>
                    <span className="type-label-sm text-muted-foreground">
                      {TYPE_META[a.type]?.label ?? a.type} · {people.data?.find((p) => p.id === a.created_by)?.name ?? '—'} · edited {fmtAgo(a.updated_at)}
                    </span>
                  </span>
                  <ArticleBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};

const Chips = ({ options, value, onChange, label, format = (s: string) => s }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void; label: string; format?: (s: string) => string }) => (
  <fieldset>
    <legend className="type-label-md mb-1.5">{label}</legend>
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            className={cn('type-label-sm h-7 rounded-full px-2.5', on ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground')}>
            {format(o)}
          </button>
        );
      })}
    </div>
  </fieldset>
);

export const ArticleEditor = () => {
  const { id = '' } = useParams();
  const me = useMe();
  const nav = useNavigate();
  const act = useAction();
  const q = useQuery({ queryKey: ['article', id], queryFn: () => repo.getArticle(id) });
  const [a, setA] = useState<Article | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    if (q.data) {
      setA(q.data);
      setDirty(false);
    }
  }, [q.data]);
  const html = useMemo(() => (a ? renderArticle(a.content) : ''), [a]);

  if (q.isLoading || (!a && q.data)) return <Empty>Loading…</Empty>;
  if (!a) return <Panel><Empty>Article not found.</Empty></Panel>;

  const editable = can.editArticle(me, a);
  const senior = can.publishArticles(me);
  const set = <K extends keyof Article>(k: K, v: Article[K]) => {
    setA((x) => (x ? { ...x, [k]: v } : x));
    setDirty(true);
  };
  const save = () => act(() => repo.saveArticle(a), 'Saved').then(() => setDirty(false));
  const status = async (s: ContentStatus, msg: string) => {
    if (dirty && editable) await repo.saveArticle(a).catch(() => undefined);
    await act(() => repo.setArticleStatus(a.id, s), msg);
    setDirty(false);
  };

  return (
    <div className="space-y-6">
      <Link to="/workspace/articles" className="type-label-md inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Articles</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <ArticleBadge status={a.status} />
          <span className="type-label-sm text-muted-foreground">{dirty ? 'Unsaved changes' : `Saved ${fmtAgo(a.updated_at)}`} · {readingMinutes(a.content)} min read</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" icon="leading" onClick={() => setPreview((p) => !p)}><Eye /> {preview ? 'Edit' : 'Preview'}</Button>
          {editable && <Button variant="outline" size="sm" onClick={save} disabled={!dirty}>Save draft</Button>}
          {editable && a.status === 'draft' && <Button size="sm" icon="trailing" onClick={() => status('in_review', 'Submitted for review')}>Submit for review <Send /></Button>}
          {senior && a.status !== 'published' && <Button size="sm" icon="leading" onClick={() => status('published', 'Published to the site')}><Upload /> Publish</Button>}
          {senior && a.status === 'in_review' && <Button size="sm" variant="outline" onClick={() => status('draft', 'Sent back to draft')}>Send back</Button>}
          {senior && a.status === 'published' && <Button size="sm" variant="outline" icon="leading" onClick={() => status('archived', 'Archived')}><Archive /> Archive</Button>}
          {can.deleteArticle(me) && (
            <Button size="icon-sm" variant="ghost" aria-label="Delete article" onClick={async () => {
              if (!window.confirm('Delete this article? This cannot be undone.')) return;
              await act(() => repo.deleteArticle(a.id), 'Deleted');
              nav('/workspace/articles');
            }}><Trash2 /></Button>
          )}
        </div>
      </div>
      {!editable && <p className="type-body-sm rounded-[10px] bg-warning/10 px-4 py-3 text-warning">This article is {ARTICLE_LABEL[a.status].toLowerCase()} and locked for you. A partner can edit it.</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <Input aria-label="Title" value={a.title} disabled={!editable} onChange={(e) => set('title', e.target.value)} className="type-headline-sm h-auto border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0" />
          <Textarea aria-label="Summary" rows={2} value={a.summary} disabled={!editable} onChange={(e) => set('summary', e.target.value)} placeholder="One or two sentences shown on cards and in search results." />
          {preview ? (
            <article className="prose-article surface-1 rounded-[12px] px-6 py-5" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div>
              <Textarea aria-label="Body" rows={24} value={a.content} disabled={!editable} onChange={(e) => set('content', e.target.value)} className="font-mono text-[13px] leading-6" placeholder={'## A heading\n\nA paragraph. **Bold**, *italic*, [a link](https://example.com).\n\n- A list item\n\n> A note or disclaimer'} />
              <p className="type-label-sm mt-1.5 text-muted-foreground">Markdown: ## heading, **bold**, *italic*, - list, 1. numbered, &gt; quote, [link](https://…). HTML is not run.</p>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <Panel title="Details">
            <div className="space-y-4 p-4">
              <Field label="Type">
                <NativeSelect className="h-10 w-full" value={a.type} disabled={!editable} onChange={(e) => set('type', e.target.value as ContentType)}>
                  {TYPES.map((t) => <option key={t} value={t}>{TYPE_META[t]?.label ?? t}</option>)}
                </NativeSelect>
              </Field>
              <Field label="URL slug" hint={`/insights/${a.slug || slugify(a.title)}`}>
                <Input value={a.slug ?? ''} disabled={!editable} onChange={(e) => set('slug', slugify(e.target.value))} placeholder={slugify(a.title)} />
              </Field>
              <Chips label="Topics" options={ARTICLE_CATEGORIES} value={a.categories} onChange={(v) => editable && set('categories', v)} />
              <Chips label="Markets" options={MARKET_CODES} value={a.markets} onChange={(v) => editable && set('markets', v)} format={(c) => MARKET_NAME[c] ?? c} />
              <Field label="Tags" hint="Comma-separated.">
                <Input value={a.tags.join(', ')} disabled={!editable} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} />
              </Field>
            </div>
          </Panel>
          <Panel title="Search & sharing">
            <div className="space-y-4 p-4">
              <Field label="SEO title" hint={`${(a.seo_title || a.title).length}/60`}><Input value={a.seo_title ?? ''} disabled={!editable} onChange={(e) => set('seo_title', e.target.value)} placeholder={a.title} /></Field>
              <Field label="SEO description" hint={`${(a.seo_description || a.summary).length}/155`}><Textarea rows={3} value={a.seo_description ?? ''} disabled={!editable} onChange={(e) => set('seo_description', e.target.value)} placeholder={a.summary} /></Field>
            </div>
          </Panel>
          <p className="type-label-sm px-1 text-muted-foreground">
            Workflow: Draft → In review → Published. {senior ? 'You can publish.' : 'A partner publishes after review.'}
          </p>
        </aside>
      </div>
    </div>
  );
};
