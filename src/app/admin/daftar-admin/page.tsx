import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // This ensures the page is not statically cached

async function getData(): Promise<User[]> {
    // Fetch data from your API here with no caching
    return await prisma.user.findMany();
}

export default async function DaftarAdmin() {
  const data = await getData();
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  
  if (user?.role !== "ADMIN") {
    redirect("/");
  }
  
  return (
    <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex w-full flex-col gap-3 row-start-2 items-center sm:items-start">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                    Daftar User
                </h2>          
                <div className="container mx-auto py-10">
                    <Button>
                        <Link href="/admin/daftar-admin/tambah">Tambah Admin</Link>
                    </Button>
                    <DataTable columns={columns} data={data} />
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
  );
}