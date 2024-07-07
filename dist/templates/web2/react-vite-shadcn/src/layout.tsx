export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="text-xl font-bold leading-[4rem]">
        <a href="/">{{projectName}}</a>
      </header>
      <main className="py-8">{children}</main>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()} {{projectName}}
      </footer>
    </>
  );
}
