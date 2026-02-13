"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { RepairTicket, RepairStatus } from "@/types";
import { mockTickets } from "@/data/mock-tickets";

type TicketAction =
  | { type: "ADD_TICKET"; payload: RepairTicket }
  | { type: "UPDATE_STATUS"; payload: { ticketId: string; status: RepairStatus } }
  | { type: "TOGGLE_CHECKLIST_ITEM"; payload: { ticketId: string; checklistItemId: string } }
  | { type: "ADD_UPDATE_LOG"; payload: { ticketId: string; message: string; isInternal: boolean } }
  | { type: "REQUEST_ADDON"; payload: { ticketId: string; catalogItemId: string } }
  | { type: "RESPOND_ADDON"; payload: { ticketId: string; requestId: string; status: "approved" | "declined" } };

interface TicketState {
  tickets: RepairTicket[];
}

function getTimestampKey(status: RepairStatus): keyof RepairTicket | null {
  const map: Partial<Record<RepairStatus, keyof RepairTicket>> = {
    [RepairStatus.CHECKED_IN]: "checkedInAt",
    [RepairStatus.DIAGNOSING]: "diagnosingAt",
    [RepairStatus.AWAITING_APPROVAL]: "awaitingApprovalAt",
    [RepairStatus.REPAIR_IN_PROGRESS]: "repairInProgressAt",
    [RepairStatus.VALIDATION]: "validationAt",
    [RepairStatus.READY_FOR_PICKUP]: "readyForPickupAt",
    [RepairStatus.CLOSED]: "closedAt",
  };
  return map[status] ?? null;
}

function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case "ADD_TICKET":
      return { ...state, tickets: [...state.tickets, action.payload] };

    case "UPDATE_STATUS": {
      const { ticketId, status } = action.payload;
      const tsKey = getTimestampKey(status);
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status,
                ...(tsKey ? { [tsKey]: new Date().toISOString() } : {}),
              }
            : t
        ),
      };
    }

    case "TOGGLE_CHECKLIST_ITEM": {
      const { ticketId, checklistItemId } = action.payload;
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                checklistItems: t.checklistItems.map((ci) =>
                  ci.id === checklistItemId ? { ...ci, checked: !ci.checked } : ci
                ),
              }
            : t
        ),
      };
    }

    case "ADD_UPDATE_LOG": {
      const { ticketId, message, isInternal } = action.payload;
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                updateLog: [
                  ...t.updateLog,
                  {
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    message,
                    isInternal,
                  },
                ],
              }
            : t
        ),
      };
    }

    case "REQUEST_ADDON": {
      const { ticketId, catalogItemId } = action.payload;
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                addOnRequests: [
                  ...t.addOnRequests,
                  {
                    id: `addon-req-${Date.now()}`,
                    catalogItemId,
                    status: "requested" as const,
                    requestedAt: new Date().toISOString(),
                  },
                ],
              }
            : t
        ),
      };
    }

    case "RESPOND_ADDON": {
      const { ticketId, requestId, status } = action.payload;
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                addOnRequests: t.addOnRequests.map((ar) =>
                  ar.id === requestId
                    ? { ...ar, status, respondedAt: new Date().toISOString() }
                    : ar
                ),
              }
            : t
        ),
      };
    }

    default:
      return state;
  }
}

const TicketContext = createContext<{
  state: TicketState;
  dispatch: React.Dispatch<TicketAction>;
} | null>(null);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ticketReducer, {
    tickets: mockTickets,
  });

  return (
    <TicketContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicketContext must be used within a TicketProvider");
  }
  return context;
}
