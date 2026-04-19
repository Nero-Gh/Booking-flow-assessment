"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2, AlertCircle } from "lucide-react";
import {
  postcodeSchema,
  type PostcodeFormData,
} from "@/app/validation/schemas";
import { useBookingStore } from "@/app/store/booking-store";
import { usePostcodeLoading, usePostcodeError } from "@/app/store/selectors";

interface PostcodeFormProps {
  onSuccess?: () => void;
}

export function PostcodeForm({ onSuccess }: PostcodeFormProps) {
  const postcodeState = useBookingStore((state) => state.postcode);
  const { lookupPostcode, setPostcode, clearPostcodeError } = useBookingStore();
  const isLoading = usePostcodeLoading();
  const storeError = usePostcodeError();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<PostcodeFormData>({
    resolver: zodResolver(postcodeSchema),
    mode: "onChange",
    defaultValues: {
      postcode: postcodeState.postcode || "",
    },
  });

  const currentPostcode = watch("postcode");

  // Sync form with store
  useEffect(() => {
    if (currentPostcode !== postcodeState.postcode) {
      setPostcode(currentPostcode || "");
    }
  }, [currentPostcode, postcodeState.postcode, setPostcode]);

  const onSubmit = async (data: PostcodeFormData) => {
    await lookupPostcode(data.postcode);

    // Check if lookup was successful (no error and addresses found)
    const state = useBookingStore.getState();
    if (!state.postcode.error && state.postcode.addresses.length > 0) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="postcode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your postcode
        </label>

        <div className="relative text-gray-800">
          <input
            {...register("postcode")}
            id="postcode"
            type="text"
            data-testid="postcode-input"
            placeholder="e.g., SW1A 1AA"
            autoComplete="postal-code"
            className={`
              w-full px-4 py-3 text-lg border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100 disabled:text-gray-500
              ${
                errors.postcode || storeError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }
            `}
            disabled={isLoading}
            aria-invalid={!!errors.postcode || !!storeError}
            aria-describedby={
              errors.postcode || storeError ? "postcode-error" : undefined
            }
          />

          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2
                className="h-5 w-5 animate-spin text-blue-500"
                data-testid="postcode-loading"
              />
            </div>
          )}
        </div>

        {/* Validation error */}
        {errors.postcode && (
          <div
            id="postcode-error"
            className="mt-2 flex items-start gap-2 text-sm text-red-600"
            data-testid="postcode-validation-error"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{errors.postcode.message}</span>
          </div>
        )}

        {/* Store error (API error) */}
        {storeError && !errors.postcode && (
          <div
            id="postcode-error"
            className="mt-2 flex items-start gap-2 text-sm text-red-600"
            data-testid="postcode-api-error"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{storeError}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        data-testid="postcode-submit"
        disabled={!isValid || isLoading}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            Find Address
          </span>
        )}
      </button>
    </form>
  );
}
