import React from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Input from "../elements/Input";
import Button from "../elements/Button";
import { BigNumber } from '@ethersproject/bignumber';

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
    walletAddress: "",
  };

  async componentDidMount() {
    sf = new SuperfluidSDK.Framework({
      web3: new Web3(window.ethereum),
    });   
    await sf.initialize()
    const walletAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
    console.log("wallet-address", walletAddress);
    this.setState({walletAddress: walletAddress[0], contractAddress: ''});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state);

    let poolArray = [];

    axios
    .get("https://618e1d3950e24d0017ce1080.mockapi.io/mock")
    .then(function (response) {
      console.log(response.data);
      let data= response.data;
      let total = data["total_kpi_target"];
      let recipeints = data["recipients"];
      
      console.log("total kpi target", recipeints); 
      recipeints.map(recipient => {
        poolArray.push({ "recipient": recipient["address"] , "shares": parseInt(recipient["work_done"]*100)/parseInt(total) });
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

    console.log("walletaddress" , this.state.walletAddress);
    const owner = sf.user({
      address: this.state.walletAddress,
      token: "0xe3CB950Cb164a31C66e32c320A800D477019DCFF",
    });
    let details = await owner.details();
    console.log(details);


    // await owner.flow({
    //   recipient: "0x230eBd3F5F443Dc8d64fA3c01f242b4F880E07c2",
    //   flowRate: "85802469135802",
    // });
    let poolId = 10;
    await owner.createPool({ poolId: poolId });
    await owner.giveShares({ poolId: poolId, recipient: '0x230eBd3F5F443Dc8d64fA3c01f242b4F880E07c2', shares: 50 });
    await owner.giveShares({ poolId: poolId, recipient: '0x5c01A52c3095E14D7c4E400D78E97A9995C42A9a', shares: 50 });

    // poolArray.map(async pool => {
    //   console.log("json for pool", {poolId: poolId, ...pool});
    //   await owner.giveShares({ poolId: poolId, ...pool });
    // });
    await owner.distributeToPool({ poolId: poolId, amount: BigNumber.from(20).pow(18).toString() });
    window.ethereum.enable();

    // const sf = new SuperfluidSDK.Framework({
    //   ethers: new Web3Provider(window.ethereum),
    // });

    // await sf.initialize();

    // const walletAddress = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    //   params: [
    //     {
    //       eth_accounts: {},
    //     },
    //   ],
    // });

    // const carol = sf.user({
    //   address: walletAddress[0],
    //   token: "0xd9Eb07994820dF2798FB335254d468246f83AB6C",
    // });

    // let details = await carol.details();
    // console.log(details);

    // await carol.flow({
    //   recipient: "0x230eBd3F5F443Dc8d64fA3c01f242b4F880E07c2",
    //   flowRate: "385802469135802",
    // });
    // details = await carol.details();
    // console.log(details);
  
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
                          label="ERC 20 Super Token Address"
                          placeholder="ERC 20 Super Token Address"
                          onChange={(e) =>
                            this.setState({ contractAddress: e.target.value })
                          }
                          required
                          state="contractAddress"
                        />
                      </div>

                      <div className="mt-24 mb-32">
                        <Button type="submit" color="primary" wide>
                          Distribute Long Tokens Instantly
                        </Button>
                      </div>
                    </fieldset>
                  </form>
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
