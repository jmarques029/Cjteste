import { UserProfile } from "../presentation/components/UserProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 text-black">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          CJnet Next.js Clean Architecture
        </h1>
        <UserProfile userId="123" />
      </main>
    </div>
  );
}
