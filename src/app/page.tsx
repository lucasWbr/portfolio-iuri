import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getTagsServer, getTrabalhosServer } from "@/lib/utils/queryServer";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tags"],
    queryFn: getTagsServer,
  });
  await queryClient.prefetchQuery({
    queryKey: ["trabalhos"],
    queryFn: getTrabalhosServer,
  });
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)));

  return <HomeClient />;
}
