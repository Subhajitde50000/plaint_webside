import { api } from "@/lib/axios";

// ─── Service Types ────────────────────────────────────────────────────────────

export const getServiceTypesApi = async () => {
  const res = await api.get("/garden-services/types");
  return res.data;
};

// ─── Create Booking ───────────────────────────────────────────────────────────

export const createBookingApi = async (data: {
  serviceTypeId: number;
  guestName?: string;
  guestPhone: string;
  addressId?: string;
  scheduledDate: string;
  scheduledTimeFrom: string;
  city: string;
  pincode: string;
  addressFull: string;
  customerNotes?: string;
}) => {
  const res = await api.post("/garden-services/bookings", {
    service_type_id: data.serviceTypeId,
    guest_name: data.guestName,
    guest_phone: data.guestPhone,
    address_id: data.addressId,
    scheduled_date: data.scheduledDate,
    scheduled_time_from: data.scheduledTimeFrom,
    city: data.city,
    pincode: data.pincode,
    address_full: data.addressFull,
    customer_notes: data.customerNotes,
  });
  return res.data;
};

// ─── Get Booking Detail ───────────────────────────────────────────────────────

export const getBookingApi = async (uuid: string) => {
  const res = await api.get(`/garden-services/bookings/${uuid}`);
  return res.data;
};
