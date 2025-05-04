import { CardSpotlight } from "@/components/ui/card-spotlight";

export function CardSpotlightDemo({ heading, count, icon } : { heading: string, count: number | undefined, icon: React.ReactElement }) {
  return (
    <CardSpotlight className="h-40 w-96">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold relative z-20 mt-2 text-white">
            {heading}
        </p>
        <p className="z-20 text-white">{icon}</p>
      </div>
      
      <p className="text-neutral-300 mt-4 relative z-20 text-xl font-bold">
        {count}
      </p>
    </CardSpotlight>
  );
}

