import {
  fetchCustomerContracts,
  type CustomerContract,
} from '@/api/core/customer';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import { NoteDoneIcon } from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { goBack } from '@/utils/navigation';
import { useQuery } from '@tanstack/react-query';
import { history } from '@umijs/max';

const contractTitle = (contract: CustomerContract) =>
  contract.contractTypeName?.trim() || 'Hợp đồng';

export function openContract(contract: CustomerContract) {
  if (!contract.contractUrl) return;
  const params = new URLSearchParams({
    url: contract.contractUrl,
    title: contractTitle(contract),
  });
  history.push(`${PAGE_URL.accountContractView}?${params}`);
}

function ContractCard({ contract }: { contract: CustomerContract }) {
  return (
    <button
      type="button"
      onClick={() => openContract(contract)}
      disabled={!contract.contractUrl}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white p-3 text-left shadow-[0_0_16px_rgba(0,0,0,0.08)] disabled:opacity-60"
    >
      <span className="grid size-9 place-items-center rounded-full bg-[#b65ffc]">
        <NoteDoneIcon
          width={17.29}
          height={18.33}
          fill0="#ffffff"
          fill1="#ffffff"
          preserveAspectRatio="xMidYMid meet"
        />
      </span>
      <span className="mt-3 line-clamp-2 text-sm leading-5 !text-[#060607]">
        {contractTitle(contract)}
      </span>
      {contract.createdDate && (
        <span className="mt-0.5 text-[10px] leading-4 !text-[rgba(10,10,11,0.55)]">
          {contract.createdDate}
        </span>
      )}
      <span className="relative mt-3 block h-36 w-full overflow-hidden rounded-md border border-[#ececec] bg-[#f7f7f7]">
        {contract.contractUrl && (
          <iframe
            title={contractTitle(contract)}
            src={`${contract.contractUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-[300%] w-[300%] origin-top-left scale-[0.3334] border-0"
          />
        )}
      </span>
    </button>
  );
}

export default function ContractList() {
  const { hasSession, customerCode, token } = useCustomerSession();
  const query = useQuery({
    queryKey: ['customer-contracts', customerCode, token],
    queryFn: ({ signal }) => fetchCustomerContracts(signal),
    enabled: hasSession,
    retry: false,
  });
  const contracts = query.data ?? [];

  return (
    <div className="min-h-full bg-white pb-8 text-[#060607]">
      <PageHeader
        title="Danh sách hợp đồng"
        align="left"
        backVariant="boxed"
        onBack={() => goBack(PAGE_URL.account)}
      />

      <div className="px-4 pt-4">
        <ProfileStatus
          loading={hasSession && query.isPending}
          error={query.error}
          retry={query.refetch}
        />
        {query.isSuccess && contracts.length === 0 && (
          <p className="py-10 text-center text-sm text-[rgba(10,10,11,0.55)]">
            Bạn chưa có hợp đồng nào.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      </div>
    </div>
  );
}
