import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoIosCloseCircle } from 'react-icons/io';

export const PriceTable = ({ price, planType, onPlanSelection }) => {
  return (
    <div
      className={`price-table col-xl-4 col-lg-12 ${
        price.isRecommended ? 'recommended' : ''
      }`}
    >
      {price.isRecommended && (
        <span className="recommended-label">Recommended</span>
      )}

      <div>
        <h4>{price.title}</h4>
        <p className="subtitle">{price.subtitle}</p>
        <p className="price-amount">
          ${price.plans[planType]?.price}
          <span>/{planType === 'monthly' ? 'Month' : 'Year'}</span>
        </p>
        <button
          className={`btn btn-lg ${
            price.isRecommended ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => onPlanSelection(price.plans[planType].id)}
        >
          {price.buttonText}
        </button>
      </div>
      <ul className="feature-list">
        {price?.features?.map((feat) => (
          <li key={feat.id} className={!feat.isAvailable ? 'unavailable' : ''}>
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
    </div>
  );
};

export default PriceTable;
