// This is an example of to protect an API route
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"

import Moralis from 'moralis';
import { useRouter } from 'next/router';
import { EvmChain } from '@moralisweb3/evm-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  // console.log('session: ', session.address)
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  //Different layout than from tutorial - they had { tokenAddress: 'string' } instead of { tokenAddresses: ['string'] }
  // console.log(' EvmChain.MUMBAI: ', EvmChain.MUMBAI)
  const nftList = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.MUMBAI,
      address: session.address,
      // tokenAddresses: ['0xacf63e56fd08970b43401492a02f6f38b6635c91'],//kanpai pandas
      tokenAddresses: ['0xF6eb78eBF8B2712301105e58bc00938C27ffe374'],
  });
  console.log("nftList: ", nftList.raw.total)

  if (nftList.raw.total > 0) {
    res.send({
      nftList: nftList.raw.result
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}
