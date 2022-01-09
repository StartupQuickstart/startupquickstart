import { useContext, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { GlobalContext } from '../context/global/provider';
import moment from 'moment';

export default function Home() {
  const { setNotifications, setMessages, setFeatures } =
    useContext(GlobalContext);

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
