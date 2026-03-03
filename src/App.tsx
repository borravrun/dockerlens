import { FiRefreshCcw } from "react-icons/fi";
import { Table, TableHead, TableHeader, TableRow } from "./components/ui/table";


export default function App() {
  
 
  return (
    <div className="bg-[#1C1C1C] w-full h-screen">
      <header className="flex items-center justify-between px-12 py-6 border-b border-[#333332]">
        <div className="flex gap-3">
          <span className="text-[#E8E8E6] text-xl font-bold">Dockerlens</span>
          <span className="text-[#6B6B6B] text-xl">/</span>
          <span className="text-[#6B6B6B] text-xl">local container (0)</span>
        </div>
        <button className="cursor-pointer">
          <FiRefreshCcw className="text-[#E8E8E6] text-xl" />
        </button>
      </header>
      <main className="px-12 pt-4">
        <Table>
          <TableHeader>
              <TableRow className="hover:bg-transparent border-b-[#333332] [&>th]:text-[#6B6B6B] [&>th]:text-center [&>th]:uppercase [&>th]:font-inter [&>th]:font-medium">
                <TableHead></TableHead>;
                <TableHead >Name</TableHead>
                <TableHead >Image</TableHead>
                <TableHead >State</TableHead>
                <TableHead >Status</TableHead>
              </TableRow>
          </TableHeader>
        </Table>
      </main>
    </div>
  )
}
