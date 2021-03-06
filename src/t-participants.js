import TImg from './t-img.js';
import {render,html} from '../node_modules/lit-html/lit-html.js'; 
import { repeat } from '../node_modules/lit-html/directives/repeat.js';
import { until } from '../node_modules/lit-html/directives/until.js';

export default class TParticipants extends HTMLElement{
    constructor() {
        super();
        this._shadowRoot=this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML=this.template;
    }

    get template(){
        return html`
            <style>
            :host{
                display:block;
            }

            #participant-list{
                display:flex;
                flex-direction:row;
                flex-wrap:wrap;
                justify-content:center;
                align-content:center;
            }

            .participant{
                width:180px;
            }

            .participant t-img{
                width:10rem;
                height:10rem;
                margin:2rem auto;
            }
            .participant h3{
                margin:0;
            }
           
            .participant .community{ 
                color: black;
            }

            .participant .desc{
                max-height:18rem;
                margin-bottom: 3rem;
            }

        /* Larger than mobile screen */
        @media (min-width: 40.0rem) { 
            #participant-list{
                flex-direction:row;
                justify-content:space-between;
            }
        }
            </style>
            <h2>Yang Akan Hadir</h2>
            <div id="participant-list">
            ${html`
                ${until(
                    fetch('data/participants.json')
                    .then(res => res.json())
                    .then(participants => {
                        return html`
                        ${repeat(
                            participants.participant,
                            participant => this.participantCard({
                                name: participant.name,
                                community: participant.community,
                                topic: participant.topic,
                                photo: participant.photo
                            })
                        )}`;
                    }),
                    html`<span> Menunggu Para Partisipan...</span>`
                )}`}
            </div>
            `;
    }

    participantCard({name, community, topic, photo}) {
        topic = topic
            .replace(/-/g,'')
            .replace(/\n/g,',');
            
        return html`
            <div class="participant">
            <t-img src=${photo} rounded></t-img>
            <h3>${name}</h3>
            <div class="community">${community}</div>
            <div class="topic">Interested In Topic</div>
            <div class="desc">${topic}</div>
            </div> 
            `;
    }

    connectedCallback() {
        this.render();
    }

    render(){
        window.requestAnimationFrame(()=>{
            render(this.template,this._shadowRoot);
        });
    }
}
