/* eslint-disable no-mixed-spaces-and-tabs */
import 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src';
import { constants } from '../../src/utils';
import {
pingReply,
sampleItems,
itemQuantityError,
itemExpiryTooPastError,
sellPayload,
fetchItemPayload
} from '../fixtures/assets';

chai.use(chaiHttp);

let expiryDate = 0;

describe('PING Server on /', () => {
  it('should response with a 200 status once the application is started', async () => {
    const response = await chai.request(app).get('/');
    expect(response).to.have.status(200);
    expect(response.body).to.eql(pingReply);
  });
});

describe('POST /:item/add', () => {
  it('should successfully add an item to the db', async () => {
    const response = await chai
    .request(app)
    .post('/foo/add')
    .send(sampleItems.foo[0]);
    expect(response).to.have.status(201);
    expect(response.body).to.eql({});
    expiryDate = sampleItems.foo[0].expiry;
  });

  it('should response with a 400 error response when invalid parameters are passed', async () => {
    const responseOne = await chai
    .request(app)
    .post('/foo/add')
    .send({
        ...sampleItems.foo[0],
        quantity: 0
    });
    expect(responseOne).to.have.status(400);
    expect(responseOne.body.error).to.eql(itemQuantityError);

    const responseTwo = await chai
    .request(app)
    .post('/foo/add')
    .send({
        ...sampleItems.foo[0],
        expiry: 2674400000
    });
    expect(responseTwo).to.have.status(400);
    expect(responseTwo.body.error).to.eql(itemExpiryTooPastError);
  });
});

describe('POST /:item/sell', () => {
    it('should successfully sell a non-expired item', async () => {
      const response = await chai
      .request(app)
      .post('/foo/sell')
      .send(sellPayload);
      expect(response).to.have.status(200);
      expect(response.body).to.eql({});
    });
  
    it('should response with a 400 error response if an invalid value is passed as the quantity parameter', async () => {
      const response = await chai
      .request(app)
      .post('/foo/sell')
      .send({
          ...sellPayload,
          quantity: 500000
      });
      expect(response).to.have.status(400);

      const responseOne = await chai
      .request(app)
      .post('/gold/sell')
      .send(sellPayload);
      expect(responseOne).to.have.status(400);
      expect(responseOne.body.error).to.eql(constants.notAvailableMsg('gold'));
    });
  });

  describe('GET /:item/quantity', () => {
    it('should successfully retrieve inventory items', async () => {
      const response = await chai
      .request(app)
      .get('/foo/quantity');
      expect(response).to.have.status(200);
      expect(response.body).to.eql({
          ...fetchItemPayload,
          validTill: expiryDate
      });
    });

    it('should response with a null value as the validTill for 0 quantity items', async () => {
        await chai
        .request(app)
        .post('/phone/add')
        .send({
            ...sampleItems.foo[0],
            expiry: 2694800000
        });

        const response = await chai
        .request(app)
        .get('/phone/quantity');
        expect(response).to.have.status(200);
        expect(response.body).to.eql({
            quantity: 0,
            validTill: null
        });
	  });
	  
	  it('should response with a  error message for wrong http verb', async () => {
		  
        const response = await chai
        .request(app)
        .post('/phone/quantity');
        expect(response).to.have.status(404);
        expect(response.body).to.eql({
            "error": "Oops, You've reached a dead end"
        });
	  });
  });
