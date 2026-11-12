import type { ReactNode } from "react";
import { Header } from "./Header";

type PageContainerProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const PageContainer = ({ title, description, children }: PageContainerProps) => (
  <section className="custom-scrollbar relative h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto bg-gray-800 px-4 pb-24 sm:px-6 md:pb-12 lg:px-10">
    <Header />
    <main className="pt-5 sm:pt-8 lg:pt-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Cinebase</p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl leading-7 text-white/60">{description}</p>
      <div className="mt-8">{children}</div>
    </main>
  </section>
);

export default PageContainer;
