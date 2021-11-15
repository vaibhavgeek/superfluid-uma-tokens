import React from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Input from "../elements/Input";
import Button from "../elements/Button";
const axios = require("axios");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const Web3 = require("web3");

const propTypes = {
  ...SectionProps.types,
};

const defaultProps = {
  ...SectionProps.defaults,
};

let sf;

class LoginForm extends React.Component {
  state = {
    contractAddress: "",
    recipientAddress: "",
    tokenStream: "",
    frequency: "",
    walletAddress: "",
  };

  
  async componentDidMount() {
    sf = new SuperfluidSDK.Framework({
      web3: new Web3(window.ethereum),
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
    console.log("wallet-address", walletAddress);
    this.setState({ walletAddress: walletAddress[0], contractAddress: "" });

    axios
      .get("https://618e1d3950e24d0017ce1080.mockapi.io/mock")
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


    const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    console.log(walletAddress[0]);
    const carol = sf.user({
      address: walletAddress[0],
      token: "0x46CE36F1e483f55CEd7f638633F929Df50bBDC65",
    });

    let details = await carol.details();
    console.log(details);

    await carol.flow({
      recipient: "0x230eBd3F5F443Dc8d64fA3c01f242b4F880E07c2",
      flowRate: "15802469135802",
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
