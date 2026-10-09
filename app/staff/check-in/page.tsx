import type {Metadata} from "next";
import {redirect} from "next/navigation";

export const metadata:Metadata={title:"Controllo accessi NIS",robots:{index:false,follow:false,noarchive:true}};
export default function LegacyStaffCheckInPage(){redirect("/checkin");}
