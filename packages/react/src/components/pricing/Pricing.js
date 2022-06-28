import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import PriceTable from './PriceTable';

import 'typeface-dm-sans';
import { useConfig } from '@/context/providers';

export const Pricing = () => {
  const [state, setState] = useState({
    planType: 'monthly'
  });

  const { config } = useConfig();
  const { pricing } = config || {};
  const { title, slogan, prices } = pricing || {};

  return (
    <section>
      <div className="container">
        <SectionHeading slogan={slogan} title={title} />
        <div className="btn-group-alt">
          <div className="btn-group-inner">
            <button
              className={state.planType === 'monthly' ? 'active' : ''}
              type="button"
              aria-label="Monthly"
              onClick={() => setState({ planType: 'monthly' })}
            >
              Monthly Plan
            </button>
            <button
              className={state.planType === 'yearly' ? 'active' : ''}
              type="button"
              aria-label="Yearly"
              onClick={() => setState({ planType: 'yearly' })}
            >
              Yearly Plan
            </button>
          </div>
        </div>
        <div className="row">
          {prices?.map((price, index) => (
            <PriceTable price={price} key={index} planType={state.planType} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
