import React, { useEffect } from 'react';
import { PageWrapper } from 'components/admin';
import { useMessage, useNotification } from 'context/providers';
import moment from 'moment';
import { Card } from 'react-bootstrap';
import CardActions from 'components/common/CardActions';

export function Home() {
  const { setNotifications } = useNotification();
  const { setMessages } = useMessage();

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = [{ name: 'Action 1' }];

  return (
    <PageWrapper title="Getting Started" subTitle="Dashboard">
      <Card>
        <Card.Header className="border-bottom">
          <CardActions
            actions={actions}
            onClick={(action) => console.log(action)}
          />
        </Card.Header>
        <Card.Body></Card.Body>
      </Card>
    </PageWrapper>
  );
}

export default Home;
