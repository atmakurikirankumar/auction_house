import React, {Fragment, useState} from 'react';

const PictureUpload = ({onPictureSelected}) => {


    return (
        <Fragment>
            <input type="file" id="imageUpload" name="imageUpload" onChange={handleFileChange} hidden/>
            <button type="button" className="btn btn-primary btn-block" onClick={chooseFile}>Pick an Image</button>
            {base64 && (<img src={base64} alt="Auction"/>)}
        </Fragment>
    );
};

export default PictureUpload;