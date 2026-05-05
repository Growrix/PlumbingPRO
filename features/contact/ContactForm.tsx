"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import type { ContactFormData } from "@/types";

const initialState: ContactFormData = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  message: "",
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.serviceType) newErrors.serviceType = "Please select a service";
    if (!form.message.trim()) newErrors.message = "Please describe your issue";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    // Simulated async submission — replace with real API call
    await new Promise((res) => setTimeout(res, 1500));
    setStatus("success");
    setForm(initialState);
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-sm p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Request Received!</h3>
        <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
          Thank you for reaching out. A member of our team will call you within 30 minutes to confirm your appointment.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")} size="md">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-neutral-200/80 shadow-sm p-8"
      noValidate
    >
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Service Request Form</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <Field label="Full Name" required error={errors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            className={inputClass(!!errors.name)}
            autoComplete="name"
          />
        </Field>

        {/* Phone */}
        <Field label="Phone Number" required error={errors.phone}>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className={inputClass(!!errors.phone)}
            autoComplete="tel"
          />
        </Field>

        {/* Email */}
        <Field label="Email Address" error={errors.email} className="sm:col-span-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClass(!!errors.email)}
            autoComplete="email"
          />
        </Field>

        {/* Service Type */}
        <Field label="Service Needed" required error={errors.serviceType} className="sm:col-span-2">
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            className={inputClass(!!errors.serviceType)}
          >
            <option value="">Select a service…</option>
            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="other">Other / Not Sure</option>
          </select>
        </Field>

        {/* Message */}
        <Field label="Describe the Issue" required error={errors.message} className="sm:col-span-2">
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Please describe the problem or what you need done…"
            rows={5}
            className={inputClass(!!errors.message)}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={status === "submitting"}
          className="w-full sm:w-auto"
        >
          Submit Service Request
        </Button>
        <p className="text-xs text-neutral-400 mt-2 sm:mt-0 leading-relaxed">
          By submitting, you agree to be contacted about your plumbing request. No spam, ever.
        </p>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-900",
    "placeholder:text-neutral-400 transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:bg-white",
    hasError
      ? "border-red-300 focus:ring-red-300"
      : "border-neutral-200 focus:ring-brand-400 focus:border-brand-400",
  ].join(" ");
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
