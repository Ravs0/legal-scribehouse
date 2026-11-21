import { useQuery } from '@tanstack/react-query';
import { Check, Minus } from 'lucide-react';
import { can, MATRIX, RANK, ROLE_LABEL, ROLE_SUMMARY } from '../access';
import { repo } from '../data';
import type { Role } from '../types';
import { Avatar, Empty, fmtAgo, NativeSelect, PageHead, Panel, RoleBadge, useAction, useMe, usePeople } from '../components/kit';

const ROLES: Role[] = ['owner', 'partner', 'lawyer', 'paralegal', 'editor', 'client'];

export const Team = () => {
  const me = useMe();
  const act = useAction();
  const people = usePeople();
  const sorted = [...(people.data ?? [])].sort((a, b) => RANK[b.role] - RANK[a.role] || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <PageHead title="Team & access" sub={can.grantRoles(me) ? 'Set each person’s access level. Changes are logged.' : 'Who has access, and what each level can do. Only the owner changes access.'} />

      <Panel title="People">
        <ul className="divide-y divide-border">
          {sorted.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Avatar name={p.name} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <p className="type-label-lg">{p.name}{p.id === me.id && <span className="font-medium text-muted-foreground"> (you)</span>}</p>
                <p className="type-label-sm text-muted-foreground">{[p.title, p.base_city, p.email].filter(Boolean).join(' · ')}</p>
              </div>
              {can.grantRoles(me) && p.id !== me.id ? (
                <NativeSelect aria-label={`Access level for ${p.name}`} value={p.role} onChange={(e) => act(() => repo.setRole(p.id, e.target.value as Role), `${p.name} is now ${ROLE_LABEL[e.target.value as Role]}`)}>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </NativeSelect>
              ) : (
                <RoleBadge role={p.role} />
              )}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Access levels">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="type-label-sm border-b border-border text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Can…</th>
                {ROLES.map((r) => <th key={r} className="px-2 py-2.5 text-center font-medium">{ROLE_LABEL[r]}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MATRIX.map((row) => (
                <tr key={row.label}>
                  <td className="type-body-sm px-4 py-2.5">{row.label}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-2 py-2.5 text-center">
                      {row.roles.includes(r)
                        ? <Check className="mx-auto h-4 w-4 text-success" aria-label="Yes" />
                        : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="No" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="grid gap-x-6 gap-y-3 border-t border-border px-4 py-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r}>
              <dt className="type-label-md">{ROLE_LABEL[r]}</dt>
              <dd className="type-body-sm text-muted-foreground">{ROLE_SUMMARY[r]}</dd>
            </div>
          ))}
        </dl>
        <p className="type-label-sm border-t border-border px-4 py-3 text-muted-foreground">
          These rules are enforced by the database (row-level security), not just hidden in the interface.
        </p>
      </Panel>
    </div>
  );
};

export const Activity = () => {
  const log = useQuery({ queryKey: ['audit'], queryFn: () => repo.listAudit(100) });
  const people = usePeople();
  return (
    <div className="space-y-6">
      <PageHead title="Activity log" sub="Changes to clients, matters, tasks, documents, enquiries, articles and access." />
      <Panel>
        {(log.data ?? []).length === 0 ? <Empty>Nothing logged yet. Changes you make appear here.</Empty> : (
          <ul className="divide-y divide-border">
            {(log.data ?? []).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
                <span className="type-mono-sm w-16 text-muted-foreground">{e.action}</span>
                <span className="type-label-md w-28 text-muted-foreground">{e.table_name}</span>
                <span className="type-body-sm min-w-0 flex-1">{e.summary}</span>
                <span className="type-label-sm text-muted-foreground">{people.data?.find((p) => p.id === e.actor_id)?.name ?? 'System'} · {fmtAgo(e.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};
