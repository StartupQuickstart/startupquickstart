import React, { useEffect, useState } from 'react';
import MissingRecords from 'components/common/MissingRecords';
import { Card } from 'react-bootstrap';
import AddMediaButton from './AddMediaButton';
import BootstrapTable from 'react-bootstrap-table-next';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Moment from 'react-moment';
import { SRLWrapper } from 'simple-react-lightbox';

import LoadingOverlay from 'components/common/LoadingOverlay';
import { Toast } from 'lib';
import { useApi } from 'context/providers';
import { ViewButton } from './ViewMediaButton';

export function Media({ canDelete, canCreate, params, parent, relatedToId }) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const { Api } = useApi();

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Deletes the media object
   */
  async function deleteMedia(mediaId) {
    setLoading(true);
    const result = await Api.get('media').v1.delete(
      '',
      { data: { id: mediaId } },
      false
    );
    setData();
    return result;
  }

  /**
   * Sets the data for the view
   */
  async function setData() {
    try {
      const { records } = await Api.get(parent).related(
        relatedToId,
        'media',
        {},
        false
      );

      setRecords(records);
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
        Toast.error('Failed to get media.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="clearfix mb-2">
        <h4 className="float-start">Media</h4>
        {canCreate && (
          <AddMediaButton
            params={params}
            className="mb-2 float-end"
            onClose={setData}
          />
        )}
      </div>
      <Card>
        {loading && <LoadingOverlay />}
        <BootstrapTable
          keyField={'id'}
          data={records}
          columns={[
            {
              dataField: 'name',
              text: 'File',
              width: 'auto',
              formatter: (name) => {
                const ext = name.split('.').pop();
                return (
                  <div>
                    <div
                      className="d-inline-block me-4"
                      style={{ width: '20px' }}
                    >
                      <FileIcon extension={ext} {...defaultStyles[ext]} />
                    </div>
                    {name}
                  </div>
                );
              }
            },
            {
              dataField: 'created_at',
              text: 'Uploaded At',
              formatter: (createdAt, media) => {
                return <Moment format={'lll'}>{createdAt}</Moment>;
              }
            },
            {
              dataField: 'id',
              text: 'Actions',
              headerAlign: 'center',
              headerStyle: { width: 'auto' },
              formatter: (createdAt, media) => {
                return (
                  <div className="text-center d-grid d-sm-block mx-auto">
                    <ViewButton media={media} />
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm mx-0 mt-2 mt-sm-0 mx-sm-1"
                      href={`${window.location.origin}/${media.path.replace(
                        'media/',
                        'media/download/'
                      )}`}
                    >
                      Download
                    </a>
                    {canDelete && (
                      <button
                        className="btn btn-white btn-sm mx-0 mt-2 mt-sm-0 mx-sm-1"
                        onClick={() => deleteMedia(media.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              }
            }
          ]}
          noDataIndication={() => (
            <MissingRecords
              title="No Media Found"
              description={`Could not find any records`}
            />
          )}
        />
      </Card>
      {!!(records && records.length) && (
        <SRLWrapper
          options={{
            buttons: {
              showDownloadButton: false
            }
          }}
          elements={records
            .filter(
              (media) =>
                media.type.startsWith('image/') ||
                media.type.startsWith('video/')
            )
            .map((media, index) => {
              const src = `${window.location.origin}/${media.path}`;

              return {
                src,
                caption: media.name,
                width: 1920,
                height: 'auto'
              };
            })}
        />
      )}
    </>
  );
}

Media.defaultProps = {
  canCreate: true,
  canDelete: true
};
