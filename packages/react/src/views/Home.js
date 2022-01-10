import React, { useEffect } from 'react';
import { PageWrapper } from '../components/admin';
import { useConfig, useMessage, useNotification } from '../context/providers';
import moment from 'moment';

export function Home() {
  const { setNotifications } = useNotification();
  const { setMessages } = useMessage();
  const { setFeatures } = useConfig();

  useEffect(() => {
    setNotifications([
      {
        date: moment().subtract(6, 'days').toDate(),
        name: 'Notify your users',
        description: 'You can add notifications for your users to see'
      }
    ]);

    setMessages([
      {
        date: new Date(),
        from: {
          name: 'Thomas Boles',
          profile_picture:
            'https://avatars.githubusercontent.com/u/10368439?s=40&v=4'
        },
        message: 'Add messages that have been sent to your users.'
      }
    ]);

    setFeatures({ messages: true, notifications: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper title="Getting Started" subTitle="Dashboard"></PageWrapper>
  );
}

export default Home;
