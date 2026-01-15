import type { DataModel, Payment } from "bysquare";

interface PaymentInfoProps {
  data: DataModel;
}

function PaymentCard({ payment, index }: { payment: Payment; index: number }) {
  const bankAccount = payment.bankAccounts[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {payment.bankAccounts.length > 1 && (
        <h3 className="mb-4 text-sm font-medium text-gray-500">
          Payment {index + 1}
        </h3>
      )}

      <div className="space-y-4">
        {bankAccount && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              IBAN
            </label>
            <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
              {bankAccount.iban}
            </p>
            {bankAccount.bic && (
              <p className="mt-1 text-sm text-gray-500">BIC: {bankAccount.bic}</p>
            )}
          </div>
        )}

        {payment.amount !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Amount
            </label>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {payment.amount.toFixed(2)} {payment.currencyCode}
            </p>
          </div>
        )}

        {payment.beneficiary?.name && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Beneficiary
            </label>
            <p className="mt-1 text-gray-900">{payment.beneficiary.name}</p>
            {payment.beneficiary.street && (
              <p className="text-sm text-gray-600">
                {payment.beneficiary.street}
              </p>
            )}
            {payment.beneficiary.city && (
              <p className="text-sm text-gray-600">{payment.beneficiary.city}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {payment.variableSymbol && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Variable Symbol
              </label>
              <p className="mt-1 font-mono text-gray-900">
                {payment.variableSymbol}
              </p>
            </div>
          )}

          {payment.constantSymbol && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Constant Symbol
              </label>
              <p className="mt-1 font-mono text-gray-900">
                {payment.constantSymbol}
              </p>
            </div>
          )}

          {payment.specificSymbol && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Specific Symbol
              </label>
              <p className="mt-1 font-mono text-gray-900">
                {payment.specificSymbol}
              </p>
            </div>
          )}
        </div>

        {payment.paymentDueDate && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Due Date
            </label>
            <p className="mt-1 text-gray-900">{payment.paymentDueDate}</p>
          </div>
        )}

        {payment.paymentNote && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Note
            </label>
            <p className="mt-1 text-gray-900">{payment.paymentNote}</p>
          </div>
        )}

        {payment.originatorsReferenceInformation && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Reference
            </label>
            <p className="mt-1 font-mono text-sm text-gray-900">
              {payment.originatorsReferenceInformation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PaymentInfo({ data }: PaymentInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg
          className="h-6 w-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">
          Pay by Square Decoded
        </h2>
      </div>

      {data.invoiceId && (
        <p className="text-sm text-gray-500">Invoice ID: {data.invoiceId}</p>
      )}

      <div className="space-y-4">
        {data.payments.map((payment, index) => (
          <PaymentCard key={index} payment={payment} index={index} />
        ))}
      </div>
    </div>
  );
}
