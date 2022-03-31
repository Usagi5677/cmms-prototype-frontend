
interface Ticket {
  icon: any;
  fullname: string;
  email: string;
  createdDate: string;
  ticketID: string;
  ticketTitle: string;
  titleDescription?: string;
  category: string;
  priority?: string;
  group?: string;
  agent?: string[];
  started?: string;
  status: string;
}

export const TicketData: Ticket[] = [
  {
    icon: "./avatar.jpg",
    fullname: "Ibrahimu naishu",
    email: "Naishu@gmail.com",
    createdDate: "01/01/2022",
    ticketID: "T01",
    ticketTitle: "Change password",
    category: "Problem",
    priority: "Medium",
    group: "Software",
    agent: ["Unassigned"],
    started: "01/01/2022",
    status: "open",
  },
];
