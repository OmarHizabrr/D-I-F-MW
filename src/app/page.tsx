import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#f8faf5] to-[#eef3e4] px-6 py-16">
      <main className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-8 rounded-full bg-white p-4 shadow-lg shadow-brand-green/10 ring-1 ring-brand-green/20">
          <Image
            src="/Image/login.png"
            alt="شعار مؤسسة التطوير والتنمية"
            width={200}
            height={200}
            priority
            className="h-auto w-44 sm:w-52"
          />
        </div>

        <p className="mb-3 text-sm font-medium tracking-wide text-brand-brown">
          EST: 10/15
        </p>

        <h1 className="mb-4 text-3xl font-bold leading-tight text-brand-green-dark sm:text-4xl">
          مؤسسة التطوير والتنمية
        </h1>

        <p className="mb-8 text-lg font-medium text-brand-brown/90">
          Development and Investment Foundation
        </p>

        <div className="mb-10 w-full rounded-2xl border border-brand-green/20 bg-white/80 px-6 py-8 shadow-sm backdrop-blur-sm">
          <p className="text-xl font-semibold text-foreground">
            مرحباً بكم
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/70">
            نعمل على بناء منصتكم الرقمية. سيتم إطلاق الموقع قريباً بإذن الله.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-5 py-2 text-sm font-medium text-brand-green-dark">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" />
          D.I.F — قيد التطوير
        </span>
      </main>
    </div>
  );
}
