// app/hooks/use-router/page.jsx
'use client';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';

export default function UseRouterPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="useRouter — Programmatic Navigation"
        description="Navigate from code instead of a clicked link — used for redirects after login, logout, and route guards."
      />
      <div className="demo">
        <button
          onClick={() =>
            window.open('https://www.google.com', '_blank')
          }
        >
          Visit Google in new tab
        </button>
        <button onClick={()=>router.push("https://google.com")}>Visit Google in same window</button>
        <button onClick={() => router.back()}>Go back()</button>
      </div>
    </>
  );
}
