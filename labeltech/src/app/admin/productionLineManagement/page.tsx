"use client";

import PageLayout from '@/components/PageLayout';
import List from '@/components/List';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/hooks/useAuth';
import Loading from '@/components/Loading';

const FakelinesData = [
  { number: 1, leader: 'Paul Aubry', state: 'Ready', action: () => console.log('Start line 1') },
  { number: 2, leader: 'Alexandre Desbos', state: 'Ready', action: () => console.log('Start line 2') },
  { number: 3, leader: 'Baptiste Griva', state: 'Ready', action: () => console.log('Start line 3') },
  { number: 4, leader: 'Francois Boussion', state: 'Running', action: () => console.log('Stop line 4') },
  { number: 5, leader: 'Logan Goddard', state: 'Ready', action: () => console.log('Start line 5') },
];

type LineDetails = {
  number: number;
  leader: string;
  state: string;
  action: () => void;
};

const Page = () => {
  useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const [loading, setLoading] = useState(true);

  const [lines, setLines] = useState<LineDetails[]>([]);

  useState(() => {
    const fetchLineDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/lineDetails");
        const lines = response.data;
        setLines(lines);
      } catch (error) {
        console.error("Error fetching line details:", error);
      }
    }
    fetchLineDetails();
  }
  );

  if (loading) {
    return(
      <Loading />
    );
  }
  else{
  return (
    <PageLayout >
    <div className='pl-8 pt-10 w-full pr-16'>
      <h2 className='text-2xl font-bold mb-10'>Production Line Management</h2>
      <List lines={lines} />
    </div>
    </PageLayout >
  );
  }
};

export default Page;