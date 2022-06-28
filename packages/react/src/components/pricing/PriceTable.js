import useStripe from '@/hooks/useStripe';
import { Toast } from '@/lib';
import React from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoIosCloseCircle } from 'react-icons/io';

export const PriceTable = ({ price, planType }) => {
  const { checkout } = useStripe();
  const plan = price?.plans[planType];

  function onPlanSelection(plan) {
    if (!plan?.id) {
      return Toast.error('Please select a plan');
    }

    checkout(plan.id);
  }

  return (
    <div className="col-xl-4 col-lg-12">
      <div className={`card ${price.isRecommended ? 'recommended' : ''}`}>
        {price.isRecommended && (
          <div
            className={`card-header ${
              price.isRecommended ? 'recommended-label' : ''
            }`}
          >
            {price.isRecommended ? 'Recommended' : ''}
          </div>
        )}

        <div className="card-body">
          <h4>{price.title}</h4>
          <p className="subtitle">{price.subtitle}</p>
          <p className="price-amount">
            ${plan?.price}
            <span>/{planType === 'monthly' ? 'Month' : 'Year'}</span>
          </p>
          <ul className="feature-list">
            {price?.features?.map((feat) => (
              <li
                key={feat.id}
                className={!feat.isAvailable ? 'unavailable' : ''}
              >
                {feat.isAvailable ? (
                  <span>
                    <IoMdCheckmarkCircle color="#FFC059" />
                  </span>
                ) : (
                  <span>
                    <IoIosCloseCircle color="#CED7E1" />
                  </span>
                )}
                <span>{feat.title}</span>
              </li>
            ))}
          </ul>
          <button
            className={`btn btn-lg w-100 ${
              price.isRecommended ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => onPlanSelection(plan)}
          >
            {price.buttonText || 'Select Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceTable;
