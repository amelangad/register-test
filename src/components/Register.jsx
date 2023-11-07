import React, { useState, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'



const PHONE_REGEX = /^[0-9]{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
export default function Register() {

  let [counter, setCounter] = useState(1);
  const refPhone = useRef(null);
  const refSms = useRef(null);
  const [name, setName] = useState('');

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false);


  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [agrEmail, setAgrEmail] = useState(false);
  const [agrPhone, setAgrPhone] = useState(false);
  const [agrSms, setAgrSms] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const result = PHONE_REGEX.test(phone);
    setValidPhone(result)

  }, [phone]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result)

  }, [email]);


  const handleSubmit = async (e) => {
    setCounter(counter + 1);
    e.preventDefault();
    console.log(counter)
    if (!refPhone.current.checked && !refSms.current.checked) {
      setErrMsg('Przynajmniej jedna zgoda na kontakt telefoniczny musi być zaznaczona')
    }
    const formData = await new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("agreement_email", agrEmail);
    formData.append("agreement_phone", agrPhone);
    formData.append("agreement_sms", agrSms);
    formData.append("error_test", email);
    if ((counter % 10) === 0) {
      formData.delete("error_test", email)
      formData.append("error_test", "")
      const res = await Object.fromEntries(formData);
      console.log(res)
    }
    const res = await Object.fromEntries(formData);
    await fetch('https://test8.it4u.company/sapi/modules/contact/form/40042ce28394dc369948c018b22c534d', {
      method: 'POST',
      body: res,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => {
        if (response.status === 200) {
          setName('')
          setEmail('')
          setPhone('')
          setErrMsg('Succes!')
        }
        else if (response.status === 409) {
          setErrMsg('Użytkownik istnieje w bazie danych')
        }
        else if (response.status === 404) {
          setErrMsg('Błąd serwera')
        }
        else {
          setErrMsg(`Kod błędu: ${response.status}`)
        }
      })


  }

  return (
    <Form onSubmit={handleSubmit} id="form" name="form"
      className="form position-absolute bg-light d-flex flex-column justify-content-center align-items-center h-auto p-3  flex shadow form-floating col-sm-6 col-md-6 col-lg-3 mx-auto">
      <Form.Group as={Row} className="flex justify-content-center gap-3">
        <Col sm="10">
          <Form.Control
            required
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="imię i nazwisko"
            className="text-center text-uppercase rounded-0"
            style={{ background: "#e0e0e0" }} />
        </Col>
        <Col sm="10">
          <Form.Control
            name="phone"
            type="tel"
            pattern="[0-9]{9}"
            title="Dziewięc cyfr, bez spacji"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="telefon"
            className="text-center text-uppercase rounded-0"
            style={{ background: "#e0e0e0" }} />
        </Col>
        <Col sm="10">
          <Form.Control
            required
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="text-center text-uppercase rounded-0"
            style={{ background: "#e0e0e0" }} />
        </Col>
        <Col sm="10" className={errMsg ? "error" : "hide"} aria-live="assertive">{errMsg}</Col>
        <Col sm="10" className="flex justify-content-centertext-black">Wyrażam zgodę na otrzymywanike od Duda  z siedzibą w Poznaniu ul. Macieja Palacza 144 60-278 Poznań, informacji handlowej</Col>
        <Col sm="10">
          <Form.Check className={` ${validEmail ? 'd-flex' : 'd-none'}`}
            required
            name="agreement_email"
            id="agreement_email"
            value={agrEmail}
            onChange={() => setAgrEmail(!agrEmail)}
            label="&nbsp; w formie elektronicznej (mail) na wskazany adres mailowy"
          /></Col>
        <Col sm="10">
          <Form.Check className={`${validPhone ? 'd-flex' : 'd-none'}`}
            id="agreement_phone"
            sm="10" type="checkbox"
            ref={refPhone}
            value={agrPhone}
            onChange={() => setAgrPhone(!agrPhone)}
            label="&nbsp; drogą telefoniczną, na udostępniony numer telefonu"
            name="agreement_phone" />
        </Col>
        <Col sm="10">
          <Form.Check className={`${validPhone ? 'd-flex' : 'd-none'}`}
            sm="10" type="checkbox"
            value={agrSms}
            onChange={() => setAgrSms(!agrSms)}
            id="agreement_sms"
            ref={refSms}
            label="&nbsp; w formie sms, na udostępniony numer telefonu"
            name="agreement_sms" />
        </Col>
      </Form.Group>
      <Button type="submit" className=" text-uppercase w-50 rounded-0 my-3 h2" style={{ background: "#8fa214", border: "#8fa214" }}><strong>Wyślij</strong></Button>
      <p className="text-decoration-underline" style={{ fontWeight: "bold" }}>Kto będzie administratorem Twoich danych osobowych?</p>
    </Form>
  );
}
