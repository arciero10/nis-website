import type {Metadata} from "next";

export const metadata:Metadata={title:"NIS Management",robots:{index:false,follow:false,noarchive:true,nocache:true,googleBot:{index:false,follow:false,noarchive:true}}};

export default function AdminLayout({children}:{children:React.ReactNode}){return children;}
