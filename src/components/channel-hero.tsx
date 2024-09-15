import { format } from "date-fns";

interface ChannelHeroProps {
  channelName: string;
  creationTime: number;
}

const ChannelHero = ({ channelName, creationTime }: ChannelHeroProps) => {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
      <p className='text-2xl font-bold flex items-center mb-2'>
        # {channelName}
      </p>
      <p className='font-normal text-slate-800 mb-4'>
        This channel was created on{" "}
        {format(new Date(creationTime), "MMMM do, yyyy")}. This is very
        beginning of the <strong>{channelName}</strong> channel.
      </p>
    </div>
  );
};

export default ChannelHero;
