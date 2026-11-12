import AuthForm from "@/components/AuthForm";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="px-4 py-14 sm:py-20">
      <AuthForm mode="register" next={next} />
    </div>
  );
}
