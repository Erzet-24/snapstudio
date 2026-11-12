import AuthForm from "@/components/AuthForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="px-4 py-14 sm:py-20">
      <AuthForm mode="login" next={next} />
    </div>
  );
}
