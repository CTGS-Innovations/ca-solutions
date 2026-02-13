"use client";

import { useTicketContext } from "@/context/ticket-context";
import { RepairTicket, RepairStatus } from "@/types";
import { mockCustomers } from "@/data/mock-customers";
import { mockDevices } from "@/data/mock-devices";
import { generateToken, generateJobNumber } from "@/lib/generate-token";
import { createChecklist } from "@/data/baseline-checklist";

export function useTickets() {
  const { state, dispatch } = useTicketContext();

  const getTicketById = (id: string): RepairTicket | undefined =>
    state.tickets.find((t) => t.id === id);

  const getTicketByToken = (token: string): RepairTicket | undefined =>
    state.tickets.find((t) => t.publicToken === token);

  const getCustomer = (customerId: string) =>
    mockCustomers.find((c) => c.id === customerId);

  const getDevice = (deviceId: string) =>
    mockDevices.find((d) => d.id === deviceId);

  const addTicket = (data: {
    customerId: string;
    deviceId: string;
    intakeNotes: string;
  }): RepairTicket => {
    const ticket: RepairTicket = {
      id: `ticket-${Date.now()}`,
      publicToken: generateToken(),
      jobNumber: generateJobNumber(),
      customerId: data.customerId,
      deviceId: data.deviceId,
      status: RepairStatus.CHECKED_IN,
      intakeNotes: data.intakeNotes,
      checklistItems: createChecklist(),
      updateLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: "Device received and condition documented. Starting intake process.",
          isInternal: false,
        },
      ],
      addOnRequests: [],
      checkedInAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_TICKET", payload: ticket });
    return ticket;
  };

  const updateStatus = (ticketId: string, status: RepairStatus) =>
    dispatch({ type: "UPDATE_STATUS", payload: { ticketId, status } });

  const toggleChecklistItem = (ticketId: string, checklistItemId: string) =>
    dispatch({ type: "TOGGLE_CHECKLIST_ITEM", payload: { ticketId, checklistItemId } });

  const addUpdateLog = (ticketId: string, message: string, isInternal: boolean = false) =>
    dispatch({ type: "ADD_UPDATE_LOG", payload: { ticketId, message, isInternal } });

  const requestAddon = (ticketId: string, catalogItemId: string) =>
    dispatch({ type: "REQUEST_ADDON", payload: { ticketId, catalogItemId } });

  const respondAddon = (ticketId: string, requestId: string, status: "approved" | "declined") =>
    dispatch({ type: "RESPOND_ADDON", payload: { ticketId, requestId, status } });

  return {
    tickets: state.tickets,
    getTicketById,
    getTicketByToken,
    getCustomer,
    getDevice,
    addTicket,
    updateStatus,
    toggleChecklistItem,
    addUpdateLog,
    requestAddon,
    respondAddon,
  };
}
