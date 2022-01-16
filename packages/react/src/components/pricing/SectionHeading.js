import React from 'react';
import classNames from 'classnames';
import { IoIosArrowForward } from 'react-icons/io';

export const SectionHeading = ({
  title,
  slogan,
  description,
  emoji,
  link,
  className,
  as
}) => {
  const Heading = as ? as.toLowerCase() : 'h3';

  return (
    <div className={classNames('section-heading', className)}>
      {slogan && <p className="slogan">{slogan}</p>}
      <Heading>
        {emoji ? <span>{title}</span> : title}
        {emoji && <img src={emoji} alt="emoji" />}
      </Heading>
      {description && <p className="description">{description}</p>}
      {link && (
        <a href={link.href}>
          {link.label} <IoIosArrowForward />
        </a>
      )}
    </div>
  );
};

export default SectionHeading;
