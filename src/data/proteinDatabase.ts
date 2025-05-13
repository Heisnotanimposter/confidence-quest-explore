
import { ProteinStructure } from "@/types/protein";

// Sample protein data with expanded selection of important proteins
const proteinDatabase: ProteinStructure[] = [
  {
    id: "p1",
    name: "Hemoglobin",
    description: {
      elementary: "Hemoglobin is a protein in your red blood cells that carries oxygen throughout your body.",
      highSchool: "Hemoglobin is a protein in red blood cells that binds to oxygen in the lungs and delivers it to tissues throughout the body.",
      undergraduate: "Hemoglobin is a tetrameric protein composed of two alpha and two beta subunits, each containing a heme group that can bind to oxygen, facilitating oxygen transport from the lungs to tissues."
    },
    function: {
      elementary: "It helps bring oxygen from your lungs to the rest of your body.",
      highSchool: "It binds oxygen in the lungs and releases it in tissues that need oxygen.",
      undergraduate: "It exhibits cooperative binding of oxygen, with the binding of one oxygen molecule increasing the affinity for subsequent oxygen molecules."
    },
    disease: {
      elementary: "If it doesn't work right, you might not get enough oxygen and feel tired.",
      highSchool: "Mutations can cause sickle cell anemia, where red blood cells become misshapen.",
      undergraduate: "Point mutations in the beta-globin gene can lead to hemoglobinopathies such as sickle cell anemia and thalassemias."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P69905",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/12788409/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3543206/"
    ],
    confidenceGuide: "High confidence indicates well-structured regions, while low confidence may suggest flexibility or uncertainty.",
    pdbId: "1HHO",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Simulate PAE data with higher values (lower confidence) between domains
          if ((i < 3 && j >= 3) || (i >= 3 && j < 3)) {
            return Math.floor(Math.random() * 15) + 10; // Higher PAE values
          }
          return Math.floor(Math.random() * 10); // Lower PAE values
        })
      )
    },
    domains: [
      {
        name: "Alpha subunit",
        start: 0,
        end: 2,
        description: "Forms part of the oxygen-binding pocket."
      },
      {
        name: "Beta subunit",
        start: 3,
        end: 6,
        description: "Contains the heme group for oxygen binding."
      }
    ]
  },
  {
    id: "p2",
    name: "Insulin",
    description: {
      elementary: "Insulin is a protein that helps your body use sugar for energy.",
      highSchool: "Insulin is a hormone that regulates blood glucose levels by facilitating glucose uptake into cells.",
      undergraduate: "Insulin is a peptide hormone produced by beta cells in the pancreatic islets, regulating carbohydrate and fat metabolism by promoting glucose uptake from the bloodstream into skeletal muscle and fat tissue."
    },
    function: {
      elementary: "It helps sugar from food get into your cells to give you energy.",
      highSchool: "It signals cells to take in glucose from the bloodstream and store excess as glycogen.",
      undergraduate: "It activates glucose transporters (primarily GLUT4) via a signaling cascade involving the insulin receptor, IRS proteins, PI3K, and Akt."
    },
    disease: {
      elementary: "If your body can't make enough insulin, you might get diabetes.",
      highSchool: "Insufficient insulin production or insulin resistance leads to diabetes mellitus.",
      undergraduate: "Autoimmune destruction of pancreatic beta cells leads to type 1 diabetes, while insulin resistance characterizes type 2 diabetes. Mutations in the insulin gene can cause neonatal diabetes."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P01308",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/3528824/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6826525/"
    ],
    confidenceGuide: "The disulfide bonds in insulin are reflected as high-confidence regions in the PAE map.",
    pdbId: "4INS",
    paeData: {
      full: Array(5).fill(Array(5).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the core
          if (i === j || Math.abs(i - j) <= 1) {
            return Math.floor(Math.random() * 5); // Higher confidence (lower PAE)
          }
          return Math.floor(Math.random() * 10) + 5; // Lower confidence (higher PAE)
        })
      )
    },
    domains: [
      {
        name: "A chain",
        start: 0,
        end: 2,
        description: "Connected to B chain by disulfide bonds."
      },
      {
        name: "B chain",
        start: 3,
        end: 4,
        description: "Forms the functional unit with A chain."
      }
    ]
  },
  {
    id: "p3",
    name: "CRISPR-Cas9",
    description: {
      elementary: "CRISPR-Cas9 is like molecular scissors that can cut DNA at specific places.",
      highSchool: "CRISPR-Cas9 is a gene-editing tool that can modify DNA sequences with high precision.",
      undergraduate: "CRISPR-Cas9 is a prokaryotic adaptive immune system repurposed for genome editing, consisting of a guide RNA that targets specific DNA sequences and the Cas9 nuclease that cleaves the DNA."
    },
    function: {
      elementary: "It helps scientists change the DNA code to fix problems or study how genes work.",
      highSchool: "It enables precise modification of genes for research, medicine, and biotechnology applications.",
      undergraduate: "It creates targeted double-strand breaks in DNA, enabling gene knockouts, insertions, deletions, or replacements through cellular DNA repair mechanisms."
    },
    disease: {
      elementary: "Scientists use it to try to fix genes that cause diseases.",
      highSchool: "It shows promise for treating genetic disorders by correcting disease-causing mutations.",
      undergraduate: "Therapeutic applications include potential treatments for sickle cell anemia, cystic fibrosis, Huntington's disease, and various cancers through ex vivo or in vivo editing."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/Q99ZW2",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/23287718/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3969860/"
    ],
    confidenceGuide: "RNA-binding domains typically show high confidence, while flexible linker regions show lower confidence.",
    pdbId: "5F9R",
    paeData: {
      full: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the core domains
          if ((i < 3 && j < 3) || (i > 4 && j > 4)) {
            return Math.floor(Math.random() * 5); // Higher confidence (lower PAE)
          } else if ((i >= 3 && i <= 4) || (j >= 3 && j <= 4)) {
            return Math.floor(Math.random() * 20) + 10; // Lower confidence (higher PAE) in linker regions
          }
          return Math.floor(Math.random() * 10) + 5; // Medium confidence
        })
      )
    },
    domains: [
      {
        name: "REC lobe",
        start: 0,
        end: 3,
        description: "Recognizes guide RNA and target DNA."
      },
      {
        name: "HNH domain",
        start: 4,
        end: 5,
        description: "Cleaves the target DNA strand."
      },
      {
        name: "RuvC domain",
        start: 6,
        end: 7,
        description: "Cleaves the non-target DNA strand."
      }
    ]
  },
  {
    id: "p4",
    name: "SARS-CoV-2 Spike",
    description: {
      elementary: "The spike protein is the part of the coronavirus that helps it enter our cells.",
      highSchool: "The SARS-CoV-2 spike protein binds to cell receptors and facilitates viral entry into host cells.",
      undergraduate: "The SARS-CoV-2 spike glycoprotein is a trimeric class I fusion protein that mediates receptor recognition and membrane fusion through conformational changes triggered by ACE2 binding."
    },
    function: {
      elementary: "It works like a key that unlocks our cells so the virus can get inside.",
      highSchool: "It binds to the ACE2 receptor on human cells, allowing the virus to enter and cause infection.",
      undergraduate: "It undergoes a dramatic conformational change from prefusion to postfusion states, with the receptor-binding domain (RBD) alternating between 'up' and 'down' conformations that affect ACE2 binding and antibody recognition."
    },
    disease: {
      elementary: "This is the protein from the virus that causes COVID-19.",
      highSchool: "Mutations in this protein can affect how easily the virus spreads and whether vaccines work well against it.",
      undergraduate: "Variants with mutations in the RBD, such as those in Alpha, Beta, Delta, and Omicron variants, can affect transmissibility, immune evasion, and pathogenicity of SARS-CoV-2."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P0DTC2",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/32075877/",
      "https://www.nature.com/articles/s41586-020-2772-0"
    ],
    confidenceGuide: "RBD regions often show medium confidence due to their flexibility, while the core structure shows higher confidence.",
    pdbId: "6VXX",
    paeData: {
      full: Array(9).fill(Array(9).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the core, lower in RBD and flexible regions
          if (i >= 3 && i <= 5 && j >= 3 && j <= 5) {
            return Math.floor(Math.random() * 15) + 5; // Medium-low confidence in RBD
          } else if (i === j || Math.abs(i - j) <= 1) {
            return Math.floor(Math.random() * 5); // Higher confidence in core
          }
          return Math.floor(Math.random() * 10) + 2; // Medium confidence elsewhere
        })
      )
    },
    domains: [
      {
        name: "S1 subunit",
        start: 0,
        end: 4,
        description: "Contains the receptor binding domain (RBD)."
      },
      {
        name: "RBD",
        start: 3,
        end: 5,
        description: "Binds to the ACE2 receptor on host cells."
      },
      {
        name: "S2 subunit",
        start: 6,
        end: 8,
        description: "Mediates membrane fusion for viral entry."
      }
    ]
  },
  {
    id: "p5",
    name: "Myosin",
    description: {
      elementary: "Myosin is a protein in your muscles that helps them move.",
      highSchool: "Myosin is a motor protein that interacts with actin to generate the force required for muscle contraction.",
      undergraduate: "Myosin is a superfamily of ATP-dependent motor proteins that interact with actin filaments to generate force and movement through a power stroke mechanism dependent on conformational changes coupled to ATP hydrolysis."
    },
    function: {
      elementary: "It works with another protein called actin to make your muscles contract, like when you bend your arm.",
      highSchool: "It converts chemical energy (ATP) into mechanical energy (movement) during muscle contraction.",
      undergraduate: "It undergoes a conformational cycle where ATP binding, hydrolysis, and product release are coupled to changes in actin affinity and lever arm positioning, resulting in directional movement along actin filaments."
    },
    disease: {
      elementary: "If it doesn't work right, your muscles might be weak or not work properly.",
      highSchool: "Mutations can cause various myopathies and cardiomyopathies affecting skeletal and cardiac muscle function.",
      undergraduate: "Mutations in different myosin genes can lead to hypertrophic cardiomyopathy, dilated cardiomyopathy, myosin storage myopathy, and other disorders with distinct molecular mechanisms affecting force generation, ATPase activity, or protein stability."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P13533",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/21527735/",
      "https://www.sciencedirect.com/science/article/abs/pii/S0022283615006610"
    ],
    confidenceGuide: "Motor domains show high confidence, while flexible regions between domains show lower confidence.",
    pdbId: "6FSA",
    paeData: {
      full: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Motor domain (0-3) has high confidence, lever arm (4-5) medium, and tail (6-7) lower
          if (i < 4 && j < 4) {
            return Math.floor(Math.random() * 5); // Higher confidence in motor domain
          } else if ((i >= 4 && i <= 5) || (j >= 4 && j <= 5)) {
            return Math.floor(Math.random() * 10) + 5; // Medium confidence in lever arm
          }
          return Math.floor(Math.random() * 15) + 10; // Lower confidence in tail
        })
      )
    },
    domains: [
      {
        name: "Motor domain",
        start: 0,
        end: 3,
        description: "Binds to actin and hydrolyzes ATP."
      },
      {
        name: "Lever arm",
        start: 4,
        end: 5,
        description: "Amplifies small conformational changes into large movements."
      },
      {
        name: "Tail",
        start: 6,
        end: 7,
        description: "Forms dimers and binds to cargo in some myosins."
      }
    ]
  },
  {
    id: "p6",
    name: "Antibody (IgG)",
    description: {
      elementary: "Antibodies are special proteins that your body makes to fight germs.",
      highSchool: "Antibodies are Y-shaped proteins produced by B cells that recognize and bind to specific foreign molecules (antigens).",
      undergraduate: "Immunoglobulin G (IgG) is the most abundant antibody isotype in serum, consisting of two heavy chains and two light chains arranged in a Y-shape, with variable regions that recognize specific epitopes on antigens."
    },
    function: {
      elementary: "They attach to germs like viruses and bacteria to help your body get rid of them.",
      highSchool: "They neutralize pathogens, mark them for destruction by other immune cells, and activate complement cascades.",
      undergraduate: "They exhibit multiple effector functions including neutralization, opsonization, complement activation, and antibody-dependent cellular cytotoxicity (ADCC) through interactions with Fc receptors and complement proteins."
    },
    disease: {
      elementary: "When you get sick, your body makes antibodies to help you get better.",
      highSchool: "Antibody deficiencies can lead to immunodeficiency disorders, while autoantibodies can cause autoimmune diseases.",
      undergraduate: "Dysregulation of antibody production is implicated in various disorders including primary immunodeficiencies (e.g., agammaglobulinemia), autoimmune diseases (e.g., rheumatoid arthritis, lupus), and hematological malignancies (e.g., multiple myeloma)."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P01834",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/21481769/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3954581/"
    ],
    confidenceGuide: "Constant domains show high confidence, while variable regions and hinges show lower confidence due to their flexibility.",
    pdbId: "1IGT",
    paeData: {
      full: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Variable regions (0-1) have lower confidence, constant regions (2-7) higher
          if ((i <= 1 || j <= 1) && i !== j) {
            return Math.floor(Math.random() * 15) + 10; // Lower confidence in variable regions
          } else if ((i >= 2 && i <= 3 && j >= 2 && j <= 3) || (i >= 4 && i <= 7 && j >= 4 && j <= 7)) {
            return Math.floor(Math.random() * 5); // Higher confidence in constant domains
          }
          return Math.floor(Math.random() * 20) + 5; // Lower confidence between domains
        })
      )
    },
    domains: [
      {
        name: "Variable region",
        start: 0,
        end: 1,
        description: "Binds to specific antigens."
      },
      {
        name: "Constant region",
        start: 2,
        end: 7,
        description: "Mediates effector functions like complement activation."
      }
    ]
  }
];

export default proteinDatabase;
