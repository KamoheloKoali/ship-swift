import { CardDemo } from '@/components/ui/aceternity/animatedCard';
import ImageCard from '@/components/ui/image-card';
import React from 'react';

const Page = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full">
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Create A New Order"
          description="Deliver"
          href='/client/dashboard/deliver'
        />
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Packaging Requirements"
          description="Before picking your service, please ensure that you have what you need to package your parcel for that service."
          href='#'
        />
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Restricted Items"
          description="There are a few items that we will not courier. Please read the Restricted Item list before placing an order."
          href='#'
        />
      </div>
    </div>
  );
};

export default Page;