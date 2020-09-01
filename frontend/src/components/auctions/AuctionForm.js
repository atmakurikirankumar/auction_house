import React, {Fragment, useContext, useState} from 'react';
import AuctionsContext from '../../contexts/auction/auctionsContext';
import AlertContext from '../../contexts/alert/alertContext'

const AuctionForm = () => {
    const auctionsContext = useContext(AuctionsContext);
    const alertContext = useContext(AlertContext);

    const {addAuction} = auctionsContext;
    const [auction, setAuction] = useState({
        title: '',
        minPrice: ''
    });
    const {setAlert} = alertContext;
    const [base64, setBase64] = useState(null);
    const chooseFile = () => {
        document.getElementById("imageUpload").click()
    }

    const handleFileChange = async e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setBase64(reader.result);

        };
    };

    const clearFields = () => {
        setAuction({title: '', minPrice: ''})
        setBase64(null)
    }

    const {title, minPrice} = auction;

    const onChange = e =>
        setAuction({...auction, [e.target.name]: e.target.value});

    const onSubmit = e => {
        if (title === '' || minPrice === '') {
            setAlert("Please enter all fields", "danger")
        }
        if (!base64) {
            setAlert("Please Upload a picture to create an Auction", "danger")
        }
        e.preventDefault();
        addAuction({...auction, data: base64})
        clearFields()
    };

    return (
        <form onSubmit={onSubmit}>
            <h2 className='text-primary'>Add Auction</h2>
            <input
                type='text'
                placeholder='Title'
                name='title'
                value={title}
                onChange={onChange}
            />
            <input
                type='text'
                placeholder='Min Price'
                name='minPrice'
                value={minPrice}
                onChange={onChange}
            />
            <Fragment>
                <input type="file" id="imageUpload" name="imageUpload" onChange={handleFileChange} hidden/>
                <button type="button" className="btn btn-primary btn-block" onClick={chooseFile}>Upload Picture</button>
                {base64 && (<img src={base64} alt="Auction"/>)}
            </Fragment>

            <div>
                <input
                    type='submit'
                    value='Add Auction'
                    className='btn btn-primary btn-block'
                />
            </div>
        </form>
    );
};

export default AuctionForm;
