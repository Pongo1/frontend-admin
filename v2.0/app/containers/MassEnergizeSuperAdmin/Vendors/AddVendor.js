import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import AddVendorForm from './AddVendorForm';

class AddVendor extends React.Component {
  render() {
    const title = brand.name + ' - Add New Vendor';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Add New Vendor" desc="Some text description">
          <AddVendorForm />
        </PapperBlock>
      </div>
    );
  }
}

export default AddVendor;
