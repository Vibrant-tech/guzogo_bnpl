"use client";

import { useMemo, useState } from "react";

type InterestType = "daily" | "monthly";

type Provider = {
  name: string;
  short: string;
  min: number;
  max: number;
  feeRate: number;
  interestType: InterestType;
  interestRate: number;
  icon: string;
};

type ProviderResult = Provider & {
  eligible: boolean;
  facilitation: number;
  interest: number;
  totalCharges: number;
  totalRepayment: number;
  dailyInstallment: number;
};

const durations = [15, 30, 45, 60, 75, 180, 365];

const providers: Provider[] = [
  {
    name: "Guzogo QuickCredit",
    short: "Fast approval",
    min: 5000,
    max: 45000,
    feeRate: 0.015,
    interestType: "daily",
    interestRate: 0.0009,
    icon: "⚡",
  },
  {
    name: "Telebirr MegaLoan Partner",
    short: "Wallet-backed finance",
    min: 10000,
    max: 85000,
    feeRate: 0.028,
    interestType: "daily",
    interestRate: 0.00075,
    icon: "📱",
  },
  {
    name: "Commercial Banking Tier",
    short: "Bank-approved ticket finance",
    min: 20000,
    max: 180000,
    feeRate: 0.035,
    interestType: "monthly",
    interestRate: 0.022,
    icon: "🏦",
  },
  {
    name: "Premium Corporate Travel Credit",
    short: "Enterprise and payroll-linked",
    min: 50000,
    max: 500000,
    feeRate: 0.055,
    interestType: "monthly",
    interestRate: 0.018,
    icon: "💼",
  },
];

function formatETB(value: number) {
  return `ETB ${Math.round(value).toLocaleString("en-US")}`;
}

function calculateProvider(
  provider: Provider,
  amount: number,
  days: number
): ProviderResult {
  const eligible = amount >= provider.min && amount <= provider.max;
  const facilitation = amount * provider.feeRate;

  const interest =
    provider.interestType === "daily"
      ? amount * provider.interestRate * days
      : amount * provider.interestRate * (days / 30);

  const totalCharges = facilitation + interest;
  const totalRepayment = amount + totalCharges;

  return {
    ...provider,
    eligible,
    facilitation,
    interest,
    totalCharges,
    totalRepayment,
    dailyInstallment: totalRepayment / days,
  };
}

export default function GuzogoTNPLCalculator() {
  const [ticketPrice, setTicketPrice] = useState<number>(25000);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const results = useMemo(() => {
    return providers.map((provider) =>
      calculateProvider(provider, ticketPrice, selectedDuration)
    );
  }, [ticketPrice, selectedDuration]);

  const bestProvider = useMemo(() => {
    const eligible = results.filter((result) => result.eligible);

    if (eligible.length === 0) return null;

    return eligible.reduce((best, current) =>
      current.totalCharges < best.totalCharges ? current : best
    );
  }, [results]);

  function handleProceed() {
    if (!bestProvider) {
      alert("No eligible TNPL provider is available for this ticket price and duration.");
      return;
    }

    alert(
      `Selected TNPL Plan:\n${bestProvider.name}\nDuration: ${selectedDuration} days\nEstimated repayment: ${formatETB(
        bestProvider.totalRepayment
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#EFC620] blur-3xl" />
          <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-[#1E1C67] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#1E1C67]/10 px-4 py-2 text-sm font-extrabold text-[#1E1C67]">
                ✈️ Travel Finance Calculator
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#1E1C67] lg:text-6xl">
                Guzogo BNPL MODEL FOR TELEBIRR Financing Calculator
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-slate-600">
                Estimate flexible airline ticket repayment plans using Travel Now,
                Pay Later financing models across approved partner tiers.
              </p>
            </div>

            <div className="max-w-sm rounded-3xl bg-[#fff] p-6 text-white shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFC620] text-xl text-[#1E1C67]">
                  💳
                </div>
                <div>
                  <p className="text-sm text-white/70">Sample route</p>
                  <h2 className="font-extrabold">ADD → DXB</h2>
                </div>
              </div>

              <p className="text-sm text-white/75">
                Use this page as a subpage/component inside the Guzogo booking flow
                before payment confirmation.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1E1C67]">
                  Ticket Price
                </h2>
                <span className="text-2xl">🎫</span>
              </div>

              <label
                htmlFor="ticketPrice"
                className="mb-2 block text-sm font-bold text-slate-600"
              >
                Enter airline ticket price in ETB
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ETB
                </span>

                <input
                  id="ticketPrice"
                  type="number"
                  min={1000}
                  value={ticketPrice}
                  onChange={(event) =>
                    setTicketPrice(Math.max(Number(event.target.value || 0), 0))
                  }
                  className="w-full rounded-2xl border-2 border-slate-200 py-4 pl-16 pr-4 text-2xl font-black text-[#1E1C67] outline-none focus:border-[#1E1C67] focus:ring-4 focus:ring-[#1E1C67]/10"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[15000, 25000, 50000].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setTicketPrice(price)}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold transition hover:bg-[#EFC620]"
                  >
                    {price / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1E1C67]">
                  Repayment Deadline
                </h2>
                <span className="text-2xl">📅</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {durations.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSelectedDuration(days)}
                    className={`min-h-[44px] rounded-2xl border px-4 py-3 font-black transition ${
                      selectedDuration === days
                        ? "border-[#EFC620] bg-[#EFC620] text-[#1E1C67] shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#1E1C67] hover:text-[#1E1C67]"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-[#1E1C67] p-6 text-white shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#EFC620]/20 blur-2xl" />

              <div className="relative">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFC620] text-[#1E1C67]">
                    📊
                  </div>
                  <div>
                    <h2 className="text-lg font-black">Financing Limits</h2>
                    <p className="text-sm text-white/65">
                      Provider eligibility ranges
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {providers.map((provider) => (
                    <div
                      key={provider.name}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="font-bold">{provider.name}</span>
                      <span className="font-black text-[#EFC620]">
                        {formatETB(provider.min)} - {formatETB(provider.max)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border-2 border-[#EFC620] bg-white p-6 shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              {bestProvider ? (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFC620] text-2xl text-[#1E1C67]">
                      🏆
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#1E1C67]">
                        Best Cost Value
                      </p>
                      <h2 className="text-2xl font-black text-[#1E1C67] lg:text-3xl">
                        {bestProvider.name}
                      </h2>
                      <p className="mt-1 text-slate-600">
                        {bestProvider.short} • Lowest estimated total fee and
                        interest footprint for {selectedDuration} days.
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[220px] rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-500">
                      Estimated Total Repayment
                    </p>
                    <p className="text-3xl font-black text-[#1E1C67]">
                      {formatETB(bestProvider.totalRepayment)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Approx. {formatETB(bestProvider.dailyInstallment)} / day
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
                    ⚠️
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-red-600">
                      No Eligible Provider
                    </p>
                    <h2 className="text-2xl font-black text-[#1E1C67]">
                      Ticket price is outside available financing limits
                    </h2>
                    <p className="mt-1 text-slate-600">
                      Reduce the ticket amount or request manual approval from a
                      partner institution.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(30,28,103,0.10)]">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#1E1C67]">
                    Provider Matrix Comparison
                  </h2>
                  <p className="text-sm text-slate-500">
                    Eligibility and estimated repayment by financing provider.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                  🔄 Auto-calculated
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Provider Name</th>
                      <th className="px-6 py-4 text-left">Allowed Limit Range</th>
                      <th className="px-6 py-4 text-left">Facilitation Fee</th>
                      <th className="px-6 py-4 text-left">Active Interest</th>
                      <th className="px-6 py-4 text-left">
                        Total Estimated Repayment
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {results.map((result) => {
                      const isBest =
                        bestProvider && result.name === bestProvider.name;

                      return (
                        <tr
                          key={result.name}
                          className={isBest ? "bg-yellow-50" : "bg-white"}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  result.eligible
                                    ? "bg-[#1E1C67] text-[#EFC620]"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {result.icon}
                              </div>

                              <div>
                                <p className="font-black text-[#1E1C67]">
                                  {result.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {result.eligible
                                    ? result.short
                                    : "Out of Limit"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 font-bold text-slate-600">
                            {formatETB(result.min)} - {formatETB(result.max)}
                          </td>

                          <td className="px-6 py-5">
                            {(result.feeRate * 100).toFixed(1)}%{" "}
                            <span className="text-slate-400">
                              ({formatETB(result.facilitation)})
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {result.interestType === "daily"
                              ? `${(result.interestRate * 100).toFixed(3)}% daily`
                              : `${(result.interestRate * 100).toFixed(
                                  2
                                )}% monthly`}
                            <span className="block text-xs text-slate-400">
                              {formatETB(result.interest)}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {result.eligible ? (
                              <span className="font-black text-[#1E1C67]">
                                {formatETB(result.totalRepayment)}
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                                Out of Limit
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1E1C67]">
                  Charge Breakdown
                </h2>
                <p className="text-sm text-slate-500">
                  Facilitation vs. base interest
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {results.map((result) => {
                  const isBest =
                    bestProvider && result.name === bestProvider.name;
                  const feePct =
                    result.totalCharges > 0
                      ? (result.facilitation / result.totalCharges) * 100
                      : 0;
                  const interestPct =
                    result.totalCharges > 0
                      ? (result.interest / result.totalCharges) * 100
                      : 0;

                  return (
                    <div
                      key={result.name}
                      className={`rounded-3xl border bg-white p-5 shadow-[0_18px_45px_rgba(30,28,103,0.10)] ${
                        isBest
                          ? "border-[#EFC620] ring-2 ring-[#EFC620]/20"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black text-[#1E1C67]">
                            {result.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {result.eligible
                              ? "Eligible for selected ticket price"
                              : "Out of limit for selected ticket price"}
                          </p>
                        </div>

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            result.eligible
                              ? "bg-[#1E1C67] text-[#EFC620]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {result.icon}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-1 flex justify-between text-sm font-bold">
                            <span>Facilitation Fee</span>
                            <span>{formatETB(result.facilitation)}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#EFC620]"
                              style={{ width: `${feePct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between text-sm font-bold">
                            <span>Base Interest</span>
                            <span>{formatETB(result.interest)}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#1E1C67]"
                              style={{ width: `${interestPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-sm font-bold text-slate-500">
                            Total Charges
                          </span>
                          <span className="text-lg font-black text-[#1E1C67]">
                            {formatETB(result.totalCharges)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(30,28,103,0.10)] lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#1E1C67]">
                Ready to continue?
              </h2>
              <p className="mt-1 text-slate-600">
                The selected plan can be passed into the booking checkout flow
                after eligibility confirmation.
              </p>
              <p className="mt-3 max-w-3xl text-xs text-slate-500">
                Regulatory note: This calculator provides an estimated financing
                simulation only. Final approval, fees, repayment period,
                penalties, credit limits, and customer eligibility depend on
                partner financial institution rules, KYC verification, and
                applicable regulations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="min-h-[48px] w-full rounded-full bg-[#EFC620] px-7 py-4 font-black text-[#1E1C67] shadow-lg shadow-yellow-200 transition hover:scale-[1.01] lg:w-auto"
            >
              Proceed to Booking with Selected Plan
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
