
// import button from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState, useEffect, useRef, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from 'uuid';

export default function FeatureExperimentGenerator() {

    const client = useLDClient();
    const { loginUser } = useContext(LoginContext);
    const [expGenerator2, setExpGenerator2] = useState(false);
    const [progress, setProgress] = useState(0);

    const updateContext = async () => {
        await loginUser('user-' + uuidv4(), 'user-' + uuidv4() + '@launchmail.io');
    }

    useEffect(() => {
        if (expGenerator2) {
            generateResults();
        }
    }, [expGenerator2]);


    const generateResults = async () => {
        setProgress(0);
        setExpGenerator2(true);
        let totalPrice = 0;
        for (let i = 0; i < 500; i++) {

            let cartSuggestedItems = client?.variation("cartSuggestedItems", false);
            if (cartSuggestedItems) {
                totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
                let probablity = Math.random() * 100;
                if (probablity < 50) {
                    client?.track("in-cart-upsell", client.getContext());
                }
                client?.track("in-cart-total-price", client.getContext(), totalPrice);
            }
            else {
                totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
                let probablity = Math.random() * 100;
                if (probablity < 50) {
                    client?.track("in-cart-upsell", client.getContext());
                }
                client?.track("in-cart-total-price", client.getContext(), totalPrice);
            }
            await client?.flush();
            setProgress((prevProgress) => prevProgress + (1 / 500) * 100);
            await new Promise(resolve => setTimeout(resolve, 100));
            await updateContext();
        }
        setExpGenerator2(false);
        await loginUser('user', 'user@launchmail.io')
    }

    return (

        <Dialog>
            <DialogTrigger asChild>
                <p className="font-bold font-sohnelight text-lg">Feature Results Generator</p>
            </DialogTrigger>
            <DialogContent>
                {expGenerator2 ? (
                    <div className="flex justify-center items-center h-52">
                        <div className=" font-bold font-sohne justify-center items-center text-xl">
                            Generating Data
                            <br />
                            <div className="flex items-center mt-2 justify-center">
                                <p>{progress.toFixed(0)}% Complete</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center text-xl font-bold items-center h-full">
                        <button onClick={() => setExpGenerator2(true)} className="mt-2 bg-gradient-experimentation p-2 rounded-sm hover:text-black hover:brightness-125 text-white">
                            Generate Feature Experiment Results
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>


    )

}