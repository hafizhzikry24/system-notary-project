import React, { useState, useEffect, useCallback, useRef } from "react";
import { showSuccess, showError, showValidationErrors } from "@/services/toastService";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { CalendarCog } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSetting } from "@/types/profileSetting";

// dynamic import of the Map (client-side only)
const MapDynamic = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
});

export function ProfileSettingsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const [profile, setProfile] = useState<ProfileSetting | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [genderOptions, setGenderOptions] = useState<string[]>([]);

  // Separate UI state for the map (so map won't remount on every profile change)
  const [latitude, setLatitude] = useState<string>("0");
  const [longitude, setLongitude] = useState<string>("0");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchData = async () => {
      try {
        const [profileResponse, genderResponse] = await Promise.all([
          api.get(`/profile-settings`),
          api.get(`/profile-settings/gender-options`),
        ]);

        const profileData = profileResponse.data.profile_settings;
        const genderData = genderResponse.data.gender_values;

        setProfile(profileData);
        setGenderOptions(genderData);

        if (profileData.birth_date) setDate(new Date(profileData.birth_date));

        // initialize map coords separately
        if (profileData.latitude) setLatitude(profileData.latitude);
        if (profileData.longitude) setLongitude(profileData.longitude);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // map callback updates only lat/lng and syncs to profile
  const handleLocationChange = useCallback((lat: string, lng: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setProfile((prev) => (prev ? { ...prev, latitude: lat, longitude: lng } : prev));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const profileToSubmit = {
        ...profile,
        latitude,
        longitude,
        birth_date: date ? format(date, "yyyy-MM-dd") : null,
      };

      await api.put(`/profile-settings`, profileToSubmit);
      router.push("/profile");
      showSuccess("Profile updated successfully!");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Something went wrong!");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">An error occurred: {error}</div>;
  }

  return (
    <form className="my-8" onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <LabelInputContainer>
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your Name"
            type="text"
            value={profile?.name || ""}
            onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
            autoComplete="name"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select
            name="gender"
            autoComplete="sex"
            value={profile?.gender || ""}
            onValueChange={(value) => setProfile((prev) => (prev ? { ...prev, gender: value } : prev))}
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </LabelInputContainer>
      </div>

      <LabelInputContainer className="mb-8">
        <Label htmlFor="birth_date_button">Tanggal Lahir</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="birth_date_button"
              type="button"
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarCog className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
          </PopoverContent>
        </Popover>
        <input id="birth_date" name="birth_date" type="hidden" value={date ? format(date, "yyyy-MM-dd") : ""} />
      </LabelInputContainer>

      <LabelInputContainer className="mb-8">
        <Label htmlFor="email">Alamat Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="projectmayhem@fc.com"
          type="email"
          value={profile?.email || ""}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
          autoComplete="email"
        />
      </LabelInputContainer>

      <LabelInputContainer className="mb-8">
        <Label htmlFor="number_phone">No Telephone</Label>
        <Input
          id="number_phone"
          name="number_phone"
          placeholder="+62..."
          type="tel"
          value={profile?.number_phone || ""}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, number_phone: e.target.value } : prev))}
          autoComplete="tel"
        />
      </LabelInputContainer>

      <div className="mb-8 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="address">Alamat</Label>
          <Input
            id="address"
            name="address"
            placeholder="Your Address"
            type="text"
            value={profile?.address || ""}
            onChange={(e) => setProfile((prev) => (prev ? { ...prev, address: e.target.value } : prev))}
            autoComplete="street-address"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="city">Kota</Label>
          <Input
            id="city"
            name="city"
            placeholder="Your City"
            type="text"
            value={profile?.city || ""}
            onChange={(e) => setProfile((prev) => (prev ? { ...prev, city: e.target.value } : prev))}
            autoComplete="address-level2"
          />
        </LabelInputContainer>
      </div>

      {/* Map section: uses separate latitude/longitude state so typing other fields won't cause Map to remount */}
      <LabelInputContainer className="my-10">
        <Label className="mt-4" htmlFor="location">
          Lokasi
        </Label>

        {/* MapDynamic is client-only; passing latitude/longitude values (primitive strings) */}
        <div className="h-72 rounded-md border overflow-hidden">
          <MapDynamic
            initialLatitude={latitude}
            initialLongitude={longitude}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Hidden inputs to satisfy label 'for' and to make form submission/autofill-friendly */}
        <input type="hidden" id="location" name="location" value={`${latitude},${longitude}`} />
        <input type="hidden" id="latitude" name="latitude" value={latitude} />
        <input type="hidden" id="longitude" name="longitude" value={longitude} />
      </LabelInputContainer>

      <button
        disabled={saving}
        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
        type="submit"
      >
        Simpan &rarr;
        <BottomGradient />
      </button>

      <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
    </form>
  );
}

function LabelInputContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}