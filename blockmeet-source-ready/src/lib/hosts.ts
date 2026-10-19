import { createPublicClient } from "@/lib/supabase/public";

export type PublicHost = {
  id: string;
  name: string;
  community: string;
  city: string;
  country: string;
  bio: string;
  socialLink: string;
};

type HostRow = Record<string, unknown>;

function textValue(row: HostRow, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

function toPublicHost(row: HostRow): PublicHost {
  return {
    id: textValue(row, ["id", "host_id"]),
    name: textValue(row, ["full_name", "display_name", "name", "host_name"], "Community host"),
    community: textValue(row, ["community_name", "community", "organization_name"], "Web3 community"),
    city: textValue(row, ["city", "location_city"]),
    country: textValue(row, ["country", "location_country"]),
    bio: textValue(row, ["bio", "description", "about", "web3_experience", "motivation"], "An approved community host helping connect people with Web3 events and opportunities."),
    socialLink: textValue(row, ["social_link", "website", "profile_url", "social_url"]),
  };
}

// The public database policy is responsible for exposing approved host profiles only.
// We deliberately select profile records and never render email or account identifiers.
export async function getPublicHosts(): Promise<PublicHost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("hosts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    if (error) console.error("getPublicHosts failed:", error.message);
    return [];
  }

  return (data as unknown as HostRow[]).map(toPublicHost).filter((host) => host.id);
}

export async function getPublicHost(id: string): Promise<PublicHost | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("hosts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toPublicHost(data as unknown as HostRow);
}
