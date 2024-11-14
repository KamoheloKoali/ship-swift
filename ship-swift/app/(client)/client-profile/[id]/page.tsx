import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ClientProfileSkeleton } from '../components/client-profile-skeleton.';
import { ClientProfileContent } from '../components/client-profile-content';
import { ClientProfileProps } from '@/types/clients';

async function getClientData(id: string) {
  const client = await prisma.clients.findUnique({
    where: { Id: id },
    include: {
      courierJobs: true,
      ClientReview: {
        include: {
          driver: true,
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return client;
}

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const clientData = await getClientData(params.id);

  return (
    <Suspense fallback={<ClientProfileSkeleton />}>
      <ClientProfileContent client={clientData as ClientProfileProps['client']} />
    </Suspense>
  );
}