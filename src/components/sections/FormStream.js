import React from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Input from "../elements/Input";
import Button from "../elements/Button";
const axios = require("axios");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const { Web3Provider } = require("@ethersproject/providers");

const propTypes = {
  ...SectionProps.types,
};

const defaultProps = {
  ...SectionProps.defaults,
};

class LoginForm extends React.Component {
  state = {
    contractAddress: "",
    recipientAddress: "",
    tokenStream: "",
    frequency: "",
  };

  componentDidMount() {
    axios
      .get("https://run.mocky.io/v3/2e64e74b-b232-431c-804a-8a5b0b0bf113")
      .then(function (response) {
        // handle success
        console.log("api json", response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state);

    window.ethereum.enable();

    const sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
    });

    await sf.initialize();

    const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    const carol = sf.user({
      address: walletAddress[0],
      token: "0xc6eB7e1d2325C8750D58a75ab71f1730f463aFA2",
    });

    let details = await carol.details();
    console.log(details);

    await carol.flow({
      recipient: "0x230eBd3F5F443Dc8d64fA3c01f242b4F880E07c2",
      flowRate: "385802469135802",
    });
    details = await carol.details();
    console.log(details);
  };

  render() {
    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      topDivider,
      bottomDivider,
      hasBgColor,
      invertColor,
      ...props
    } = this.props;

    const outerClasses = classNames(
      "signin section",
      topOuterDivider && "has-top-divider",
      bottomOuterDivider && "has-bottom-divider",
      hasBgColor && "has-bg-color",
      invertColor && "invert-color",
      className
    );

    const sectionHeader = {
      title: "KPI Options Token Distribution via Superfluid Streams",
    };

    return (
      <section {...props} className={outerClasses}>
        <div className="container">
          <div>
            <SectionHeader
              tag="h3"
              data={sectionHeader}
              className="center-content"
            />
            <div className="tiles-wrap">
              <div className="tiles-item">
                <div className="tiles-item-inner">
                  <form onSubmit={this.handleSubmit}>
                    <fieldset>
                      <div className="mb-12">
                        <Input
                          type="input"
                          label="Contract Address"
                          placeholder="Contract Address"
                          onChange={(e) =>
                            this.setState({ contractAddress: e.target.value })
                          }
                          required
                          state="contractAddress"
                        />
                      </div>

                      <div className="mb-12">
                        <Input
                          type="input"
                          label="Recipient Address"
                          placeholder="Recipient Address"
                          required
                          onChange={(e) =>
                            this.setState({ recipientAddress: e.target.value })
                          }
                        />
                      </div>
                      <label className="form-label"> Token Stream </label>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gridTemplateColumns: "6fr 6fr",
                        }}
                        className="mb-12"
                      >
                        <Input
                          type="input"
                          placeholder="Tokens"
                          required
                          onChange={(e) =>
                            this.setState({ tokenStream: e.target.value })
                          }
                        />
                        <select
                          onChange={(e) =>
                            this.setState({ frequency: e.target.value })
                          }
                          style={{ width: "40%" }}
                        >
                          <option>day</option>
                          <option> week </option>
                          <option> month </option>
                          <option>year</option>
                        </select>
                      </div>
                      <div className="mt-24 mb-32">
                        <Button type="submit" color="primary" wide>
                          Start Stream
                        </Button>
                      </div>
                    </fieldset>
                  </form>
                  <div className="signin-bottom has-top-divider">
                    <div className="pt-32 text-xs center-content text-color-low">
                      <pre>
                        You can trigger stream <br />
                        using any other methods as well. <br />
                        <br />
                        Check Documentation
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

LoginForm.propTypes = propTypes;
LoginForm.defaultProps = defaultProps;

export default LoginForm;
