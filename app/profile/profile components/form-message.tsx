"use client";

interface FormMessageProps {
  message: { message?: string };
}

export function FormMessage({ message }: FormMessageProps) {
  return (
    <div className="rounded-md bg-green-100 p-4 text-sm text-green-500">
      {message?.message}
    </div>
  );
}
