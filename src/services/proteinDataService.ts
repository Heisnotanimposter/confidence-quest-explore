import { ConfidenceLevel, ProteinStructure } from "@/types/game";

// Define protein structure types for different visualizations
export type PaeMapType = 'full' | 'domain' | 'interface';

// Define species type
export type Species = 
  | 'Homo sapiens'
  | 'Saccharomyces cerevisiae'
  | 'Bacillus subtilis'
  | 'Plasmodium falciparum'
  | 'Drosophila melanogaster'
  | 'Borreliella burgdorferi B31'
  | 'Helicobacter pylori 26695'
  | 'Mus musculus'
  | 'Escherichia coli K12 MG1655'
  | 'Aequorea victoria';

// Sample protein data (in real implementation, this would come from an API or larger dataset)
const proteinDatabase: ProteinStructure[] = [
  // Homo sapiens proteins
  {
    id: "p1",
    name: "Hemoglobin",
    species: "Homo sapiens",
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
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on alpha subunit (domain-specific view)
          if (i < 3 && j < 3) {
            return Math.floor(Math.random() * 5); // High confidence in alpha domain
          }
          return Math.floor(Math.random() * 15) + 10; // Lower confidence outside domain
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on interface between alpha and beta subunits
          if ((i === 2 && j === 3) || (i === 3 && j === 2)) {
            return Math.floor(Math.random() * 15) + 10; // Higher PAE at interface
          }
          return Math.floor(Math.random() * 5); // Lower PAE elsewhere
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
    species: "Homo sapiens",
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
      ),
      domain: Array(5).fill(Array(5).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on A chain (domain-specific view)
          if (i < 2 && j < 2) {
            return Math.floor(Math.random() * 5); // High confidence in A chain
          }
          return Math.floor(Math.random() * 15) + 10; // Lower confidence outside domain
        })
      ),
      interface: Array(5).fill(Array(5).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on interface between A and B chains
          if ((i === 1 && j === 2) || (i === 2 && j === 1)) {
            return Math.floor(Math.random() * 15) + 10; // Higher PAE at interface
          }
          return Math.floor(Math.random() * 5); // Lower PAE elsewhere
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
    name: "Myoglobin",
    species: "Homo sapiens",
    description: {
      elementary: "Myoglobin is a protein that stores oxygen in your muscles, helping them work even when you're holding your breath.",
      highSchool: "Myoglobin is a single-chain protein that stores oxygen in muscle tissue, allowing for sustained muscle activity during periods of oxygen deprivation.",
      undergraduate: "Myoglobin is a monomeric oxygen-binding protein found in muscle tissue, containing a single heme group that binds oxygen with high affinity, serving as an oxygen reservoir during periods of muscle activity."
    },
    function: {
      elementary: "It helps your muscles store oxygen for when they need it.",
      highSchool: "It stores oxygen in muscle tissue and releases it during intense activity.",
      undergraduate: "It binds oxygen with high affinity and serves as an oxygen reservoir in muscle tissue, particularly important for diving mammals and during intense muscle activity."
    },
    disease: {
      elementary: "If it doesn't work right, your muscles might get tired quickly.",
      highSchool: "Mutations can affect muscle oxygen storage and lead to muscle fatigue.",
      undergraduate: "Mutations in the myoglobin gene can lead to myoglobinuria and muscle damage, while its presence in urine can indicate muscle injury or disease."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P02144",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/12788409/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3543206/"
    ],
    confidenceGuide: "The heme-binding pocket shows high confidence, while surface loops may show lower confidence due to flexibility.",
    pdbId: "1MBO",
    paeData: {
      full: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the core, lower in loops
          if (Math.abs(i - j) <= 1) {
            return Math.floor(Math.random() * 5); // High confidence
          }
          return Math.floor(Math.random() * 10) + 5; // Lower confidence
        })
      ),
      domain: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on heme binding domain
          if (i < 3 && j < 3) {
            return Math.floor(Math.random() * 5); // High confidence in heme domain
          }
          return Math.floor(Math.random() * 15) + 10; // Lower confidence outside domain
        })
      ),
      interface: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on interface between heme domain and helical bundle
          if ((i === 2 && j === 3) || (i === 3 && j === 2)) {
            return Math.floor(Math.random() * 15) + 10; // Higher PAE at interface
          }
          return Math.floor(Math.random() * 5); // Lower PAE elsewhere
        })
      )
    },
    domains: [
      {
        name: "Heme binding domain",
        start: 0,
        end: 2,
        description: "Contains the heme group for oxygen binding."
      },
      {
        name: "Helical bundle",
        start: 3,
        end: 5,
        description: "Forms the structural core of the protein."
      }
    ]
  },
  {
    id: "p5",
    name: "p53",
    species: "Homo sapiens",
    description: {
      elementary: "p53 is a protein that helps protect your cells from becoming cancer.",
      highSchool: "p53 is a tumor suppressor protein that helps prevent cancer by stopping damaged cells from growing.",
      undergraduate: "p53 is a transcription factor that regulates cell cycle, DNA repair, and apoptosis, playing a crucial role in preventing cancer development."
    },
    function: {
      elementary: "It helps stop cells from growing when they're damaged.",
      highSchool: "It stops damaged cells from dividing and can trigger cell death if damage is too severe.",
      undergraduate: "It functions as a transcription factor that activates genes involved in cell cycle arrest, DNA repair, and apoptosis in response to cellular stress."
    },
    disease: {
      elementary: "If it doesn't work right, cells might grow too much and cause cancer.",
      highSchool: "Mutations in p53 are found in about 50% of all human cancers, leading to uncontrolled cell growth.",
      undergraduate: "Mutations in TP53 are associated with Li-Fraumeni syndrome and are found in approximately 50% of all human cancers, affecting its tumor suppressor function."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P04637",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/12006501/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1994615/"
    ],
    confidenceGuide: "The DNA-binding domain shows high confidence, while the N and C-terminal regions may show lower confidence due to their regulatory functions.",
    pdbId: "1TUP",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the DNA-binding domain
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5); // High confidence
          }
          return Math.floor(Math.random() * 10) + 5; // Lower confidence
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on DNA-binding domain
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5); // High confidence in DNA-binding domain
          }
          return Math.floor(Math.random() * 15) + 10; // Lower confidence outside domain
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Focus on interfaces between domains
          if ((i === 1 && j === 2) || (i === 2 && j === 1) || // N-terminal to DNA-binding
              (i === 4 && j === 5) || (i === 5 && j === 4)) { // DNA-binding to C-terminal
            return Math.floor(Math.random() * 15) + 10; // Higher PAE at interfaces
          }
          return Math.floor(Math.random() * 5); // Lower PAE elsewhere
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 1,
        description: "Contains transactivation domain."
      },
      {
        name: "DNA-binding",
        start: 2,
        end: 4,
        description: "Binds to specific DNA sequences."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 6,
        description: "Involved in oligomerization."
      }
    ]
  },
  {
    id: "p6",
    name: "BRCA1",
    species: "Homo sapiens",
    description: {
      elementary: "BRCA1 is a protein that helps fix damaged DNA in your cells.",
      highSchool: "BRCA1 is a tumor suppressor protein that repairs DNA damage and helps prevent cancer.",
      undergraduate: "BRCA1 is a tumor suppressor protein involved in DNA repair, cell cycle checkpoint control, and maintenance of genomic stability."
    },
    function: {
      elementary: "It helps keep your DNA healthy and working properly.",
      highSchool: "It repairs damaged DNA and helps prevent cells from growing out of control.",
      undergraduate: "It functions in homologous recombination repair of DNA double-strand breaks and maintenance of genomic stability."
    },
    disease: {
      elementary: "If it doesn't work right, you might have a higher chance of getting certain types of cancer.",
      highSchool: "Mutations in BRCA1 are associated with increased risk of breast and ovarian cancer.",
      undergraduate: "Germline mutations in BRCA1 are associated with hereditary breast and ovarian cancer syndrome."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P38398",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/8896451/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3423894/"
    ],
    confidenceGuide: "The RING and BRCT domains show high confidence, while the central region may show lower confidence due to its flexible nature.",
    pdbId: "1JM7",
    paeData: {
      full: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 5 && j === 6) || (i === 6 && j === 5)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "RING domain",
        start: 0,
        end: 1,
        description: "Involved in ubiquitin ligase activity."
      },
      {
        name: "BRCT domain",
        start: 2,
        end: 5,
        description: "Mediates protein-protein interactions."
      },
      {
        name: "C-terminal",
        start: 6,
        end: 7,
        description: "Involved in DNA repair functions."
      }
    ]
  },
  // Saccharomyces cerevisiae proteins
  {
    id: "p7",
    name: "SIR2",
    species: "Saccharomyces cerevisiae",
    description: {
      elementary: "SIR2 is a protein that helps control how genes work in yeast cells.",
      highSchool: "SIR2 is a histone deacetylase that regulates gene expression and aging in yeast.",
      undergraduate: "SIR2 is a NAD+-dependent histone deacetylase that regulates gene silencing, DNA repair, and lifespan in Saccharomyces cerevisiae."
    },
    function: {
      elementary: "It helps yeast cells live longer by controlling which genes are active.",
      highSchool: "It removes chemical groups from DNA packaging proteins to control gene activity.",
      undergraduate: "It catalyzes the NAD+-dependent deacetylation of histone lysine residues, leading to chromatin silencing and regulation of cellular processes."
    },
    disease: {
      elementary: null,
      highSchool: "While not directly involved in human disease, it helps us understand aging.",
      undergraduate: "SIR2 homologs in humans (sirtuins) are implicated in aging, metabolism, and age-related diseases."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P06700",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10693811/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2811751/"
    ],
    confidenceGuide: "The catalytic domain shows high confidence, while the N and C-terminal regions may show lower confidence due to their regulatory functions.",
    pdbId: "1MA3",
    paeData: {
      full: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 0 && j === 1) || (i === 1 && j === 0) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 0,
        description: "Regulatory region."
      },
      {
        name: "Catalytic domain",
        start: 1,
        end: 4,
        description: "Contains the NAD+-dependent deacetylase activity."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 5,
        description: "Involved in protein interactions."
      }
    ]
  },
  // Escherichia coli proteins
  {
    id: "p8",
    name: "LacZ",
    species: "Escherichia coli K12 MG1655",
    description: {
      elementary: "LacZ is a protein that helps bacteria break down milk sugar.",
      highSchool: "LacZ is a beta-galactosidase enzyme that breaks down lactose into glucose and galactose.",
      undergraduate: "LacZ is a tetrameric beta-galactosidase enzyme that catalyzes the hydrolysis of lactose into glucose and galactose, and is widely used as a reporter gene in molecular biology."
    },
    function: {
      elementary: "It helps bacteria use milk sugar as food.",
      highSchool: "It breaks down lactose into simpler sugars that bacteria can use for energy.",
      undergraduate: "It catalyzes the hydrolysis of beta-galactosides, including lactose, into monosaccharides, and is commonly used as a reporter gene in gene expression studies."
    },
    disease: {
      elementary: null,
      highSchool: "While not directly involved in human disease, it's important for understanding gene regulation.",
      undergraduate: "While not pathogenic, LacZ is a crucial tool in molecular biology for studying gene expression and regulation."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P00722",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/4913910/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2137137/"
    ],
    confidenceGuide: "The active site shows high confidence, while the interface between subunits may show lower confidence due to flexibility.",
    pdbId: "1DP0",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 1,
        description: "Involved in tetramer formation."
      },
      {
        name: "Active site",
        start: 2,
        end: 4,
        description: "Contains the catalytic residues."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 6,
        description: "Involved in substrate binding."
      }
    ]
  },
  // Bacillus subtilis proteins
  {
    id: "p9",
    name: "ComK",
    species: "Bacillus subtilis",
    description: {
      elementary: "ComK is a protein that helps bacteria become able to take up DNA from their environment.",
      highSchool: "ComK is a transcription factor that controls the development of competence in Bacillus subtilis, allowing the bacteria to take up foreign DNA.",
      undergraduate: "ComK is a master regulator of competence development in Bacillus subtilis, functioning as a transcription factor that activates the expression of genes required for DNA uptake and transformation."
    },
    function: {
      elementary: "It helps bacteria learn new traits by taking up DNA from their surroundings.",
      highSchool: "It turns on genes that allow the bacteria to take up and use DNA from their environment.",
      undergraduate: "It functions as a transcription factor that activates the expression of late competence genes, including those encoding the DNA uptake machinery and recombination proteins."
    },
    disease: {
      elementary: null,
      highSchool: "While not directly involved in human disease, it helps us understand how bacteria evolve and adapt.",
      undergraduate: "While not pathogenic itself, understanding ComK regulation provides insights into bacterial evolution and horizontal gene transfer mechanisms."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P39693",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The DNA-binding domain shows high confidence, while the regulatory regions may show lower confidence due to their flexible nature.",
    pdbId: "1F5S",
    paeData: {
      full: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 0 && j === 1) || (i === 1 && j === 0) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 0,
        description: "Regulatory region."
      },
      {
        name: "DNA-binding domain",
        start: 1,
        end: 4,
        description: "Binds to specific DNA sequences."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 5,
        description: "Involved in protein stability."
      }
    ]
  },
  {
    id: "p10",
    name: "Spo0A",
    species: "Bacillus subtilis",
    description: {
      elementary: "Spo0A is a protein that helps bacteria form spores when conditions are tough.",
      highSchool: "Spo0A is a response regulator that controls the initiation of sporulation in Bacillus subtilis when nutrients are limited.",
      undergraduate: "Spo0A is a response regulator in the two-component signal transduction system that initiates the sporulation program in Bacillus subtilis under conditions of nutrient limitation."
    },
    function: {
      elementary: "It helps bacteria survive bad conditions by forming protective spores.",
      highSchool: "It turns on genes that help the bacteria form spores when food is scarce.",
      undergraduate: "It functions as a transcription factor that activates the expression of genes required for sporulation, including those involved in asymmetric cell division and spore coat formation."
    },
    disease: {
      elementary: null,
      highSchool: "While not directly involved in human disease, it helps us understand how bacteria survive harsh conditions.",
      undergraduate: "While not pathogenic itself, understanding Spo0A regulation provides insights into bacterial persistence and survival mechanisms."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P07803",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The DNA-binding domain shows high confidence, while the phosphorylation site may show lower confidence due to its dynamic nature.",
    pdbId: "1QMP",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "Receiver domain",
        start: 0,
        end: 1,
        description: "Contains the phosphorylation site."
      },
      {
        name: "DNA-binding domain",
        start: 2,
        end: 4,
        description: "Binds to specific DNA sequences."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 6,
        description: "Involved in protein-protein interactions."
      }
    ]
  },
  // Plasmodium falciparum proteins
  {
    id: "p11",
    name: "PfEMP1",
    species: "Plasmodium falciparum",
    description: {
      elementary: "PfEMP1 is a protein that helps malaria parasites hide from our immune system.",
      highSchool: "PfEMP1 is a variant surface antigen that helps malaria parasites avoid immune detection by changing its appearance.",
      undergraduate: "PfEMP1 is a variant surface antigen expressed on infected red blood cells that mediates cytoadherence and antigenic variation in Plasmodium falciparum."
    },
    function: {
      elementary: "It helps malaria parasites stay hidden from our body's defenses.",
      highSchool: "It helps the parasite stick to blood vessel walls and change its appearance to avoid immune detection.",
      undergraduate: "It mediates cytoadherence of infected red blood cells to endothelial cells and undergoes antigenic variation to evade host immune responses."
    },
    disease: {
      elementary: "It helps cause malaria, a serious disease spread by mosquitoes.",
      highSchool: "It's a key factor in the severity of malaria, helping the parasite avoid immune detection and cause severe disease.",
      undergraduate: "It's a major virulence factor in severe malaria, contributing to cytoadherence, immune evasion, and the development of cerebral malaria."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/Q8I0B7",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The DBL domains show high confidence, while the interdomain regions may show lower confidence due to their flexible nature.",
    pdbId: "3BQK",
    paeData: {
      full: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(8).fill(Array(8).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 5 && j === 6) || (i === 6 && j === 5)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 1,
        description: "Signal sequence."
      },
      {
        name: "DBL domains",
        start: 2,
        end: 5,
        description: "Mediate cytoadherence."
      },
      {
        name: "C-terminal",
        start: 6,
        end: 7,
        description: "Transmembrane domain."
      }
    ]
  },
  // Drosophila melanogaster proteins
  {
    id: "p12",
    name: "Toll",
    species: "Drosophila melanogaster",
    description: {
      elementary: "Toll is a protein that helps fruit flies fight off infections.",
      highSchool: "Toll is a receptor protein that helps fruit flies recognize and respond to infections.",
      undergraduate: "Toll is a transmembrane receptor that plays a crucial role in the innate immune response and embryonic development in Drosophila melanogaster."
    },
    function: {
      elementary: "It helps fruit flies detect and fight off germs.",
      highSchool: "It recognizes patterns on pathogens and triggers the immune response.",
      undergraduate: "It functions as a pattern recognition receptor that activates the NF-κB signaling pathway in response to microbial patterns."
    },
    disease: {
      elementary: null,
      highSchool: "While not directly involved in human disease, it helps us understand how our immune system works.",
      undergraduate: "Toll-like receptors in humans are homologous to Drosophila Toll and play crucial roles in innate immunity and inflammatory diseases."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P08953",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The extracellular domain shows high confidence, while the intracellular signaling domain may show lower confidence due to its dynamic nature.",
    pdbId: "3FXI",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 5 && j >= 1 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 5 && j >= 1 && j <= 5) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 0 && j === 1) || (i === 1 && j === 0) ||
              (i === 5 && j === 6) || (i === 6 && j === 5)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "Extracellular domain",
        start: 0,
        end: 2,
        description: "Contains leucine-rich repeats."
      },
      {
        name: "Transmembrane domain",
        start: 3,
        end: 3,
        description: "Anchors protein in membrane."
      },
      {
        name: "Intracellular domain",
        start: 4,
        end: 6,
        description: "Contains TIR domain for signaling."
      }
    ]
  },
  // Borreliella burgdorferi proteins
  {
    id: "p13",
    name: "OspA",
    species: "Borreliella burgdorferi B31",
    description: {
      elementary: "OspA is a protein on the surface of the bacteria that causes Lyme disease.",
      highSchool: "OspA is a major outer surface protein of the Lyme disease bacterium that helps it survive in ticks.",
      undergraduate: "OspA is a lipoprotein that serves as a major outer surface protein of Borreliella burgdorferi, playing a crucial role in tick colonization and transmission."
    },
    function: {
      elementary: "It helps the bacteria live in ticks and cause Lyme disease.",
      highSchool: "It helps the bacteria attach to tick gut cells and survive in the tick environment.",
      undergraduate: "It mediates attachment to tick gut cells and is involved in the transmission of the bacterium from ticks to mammalian hosts."
    },
    disease: {
      elementary: "It helps cause Lyme disease, which can make people very sick.",
      highSchool: "It's a key factor in the transmission of Lyme disease from ticks to humans.",
      undergraduate: "It's a major virulence factor in Lyme disease transmission and is the target of the first FDA-approved Lyme disease vaccine."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P0CL66",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The central domain shows high confidence, while the N and C-terminal regions may show lower confidence due to their flexible nature.",
    pdbId: "1OSP",
    paeData: {
      full: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 1 && i <= 4 && j >= 1 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(6).fill(Array(6).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 0 && j === 1) || (i === 1 && j === 0) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 0,
        description: "Lipid attachment site."
      },
      {
        name: "Central domain",
        start: 1,
        end: 4,
        description: "Contains antigenic epitopes."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 5,
        description: "Involved in protein stability."
      }
    ]
  },
  // Helicobacter pylori proteins
  {
    id: "p14",
    name: "CagA",
    species: "Helicobacter pylori 26695",
    description: {
      elementary: "CagA is a protein that helps bacteria cause stomach problems.",
      highSchool: "CagA is a virulence factor that helps Helicobacter pylori cause stomach inflammation and ulcers.",
      undergraduate: "CagA is a type IV secretion system effector protein that is injected into host cells and causes cellular changes leading to inflammation and cancer."
    },
    function: {
      elementary: "It helps the bacteria damage the stomach lining.",
      highSchool: "It gets injected into stomach cells and changes how they work, leading to inflammation.",
      undergraduate: "It functions as a bacterial oncoprotein that is injected into host cells via the type IV secretion system, where it disrupts cell signaling and promotes inflammation."
    },
    disease: {
      elementary: "It helps cause stomach problems like ulcers and inflammation.",
      highSchool: "It's a major factor in causing stomach ulcers and increasing the risk of stomach cancer.",
      undergraduate: "It's a key virulence factor associated with increased risk of peptic ulcers and gastric cancer, through its effects on host cell signaling and inflammation."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P55981",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The EPIYA motifs show high confidence, while the N-terminal region may show lower confidence due to its flexible nature.",
    pdbId: "2GX2",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 1,
        description: "Secretion signal."
      },
      {
        name: "EPIYA motifs",
        start: 2,
        end: 4,
        description: "Phosphorylation sites."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 6,
        description: "Interaction domain."
      }
    ]
  },
  // Mus musculus proteins
  {
    id: "p15",
    name: "p53",
    species: "Mus musculus",
    description: {
      elementary: "p53 is a protein that helps protect mouse cells from becoming cancer.",
      highSchool: "p53 is a tumor suppressor protein that helps prevent cancer by stopping damaged cells from growing.",
      undergraduate: "p53 is a transcription factor that regulates cell cycle, DNA repair, and apoptosis, playing a crucial role in preventing cancer development in mice."
    },
    function: {
      elementary: "It helps stop cells from growing when they're damaged.",
      highSchool: "It stops damaged cells from dividing and can trigger cell death if damage is too severe.",
      undergraduate: "It functions as a transcription factor that activates genes involved in cell cycle arrest, DNA repair, and apoptosis in response to cellular stress."
    },
    disease: {
      elementary: "If it doesn't work right, cells might grow too much and cause cancer.",
      highSchool: "Mutations in p53 are found in many mouse cancers, leading to uncontrolled cell growth.",
      undergraduate: "Mutations in Trp53 (mouse p53) are associated with increased cancer susceptibility and are used to model human cancer in mice."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P02340",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/10613877/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC99087/"
    ],
    confidenceGuide: "The DNA-binding domain shows high confidence, while the N and C-terminal regions may show lower confidence due to their regulatory functions.",
    pdbId: "1TUP",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 10) + 5;
        })
      ),
      domain: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            return Math.floor(Math.random() * 5);
          }
          return Math.floor(Math.random() * 15) + 10;
        })
      ),
      interface: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          if ((i === 1 && j === 2) || (i === 2 && j === 1) ||
              (i === 4 && j === 5) || (i === 5 && j === 4)) {
            return Math.floor(Math.random() * 15) + 10;
          }
          return Math.floor(Math.random() * 5);
        })
      )
    },
    domains: [
      {
        name: "N-terminal",
        start: 0,
        end: 1,
        description: "Contains transactivation domain."
      },
      {
        name: "DNA-binding",
        start: 2,
        end: 4,
        description: "Binds to specific DNA sequences."
      },
      {
        name: "C-terminal",
        start: 5,
        end: 6,
        description: "Involved in oligomerization."
      }
    ]
  }
];

// Convert PAE data to confidence levels
export function convertPaeToConfidence(paeValue: number): ConfidenceLevel {
  if (paeValue < 5) {
    return "high";
  } else if (paeValue < 15) {
    return "medium";
  } else {
    return "low";
  }
}

// Function to generate a grid based on the selected protein and PAE map type
export function generatePaeGrid(
  proteinId: string,
  mapType: PaeMapType = 'full',
  gridSize: number = 5
): { grid: any[][], proteinData: ProteinStructure } {
  // Find the protein
  const protein = proteinDatabase.find(p => p.id === proteinId) || proteinDatabase[0];
  
  // Get appropriate PAE data based on map type
  const paeData = protein.paeData[mapType] || protein.paeData.full;
  
  // Convert PAE data to confidence grid
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      // Map i,j to paeData indices based on available data
      const paeRow = Math.floor(i * paeData.length / gridSize);
      const paeCol = Math.floor(j * paeData[0].length / gridSize);
      
      const paeValue = paeData[paeRow][paeCol];
      const confidence = convertPaeToConfidence(paeValue);
      
      row.push({
        row: i,
        col: j,
        confidence
      });
    }
    grid.push(row);
  }
  
  return { grid, proteinData: protein };
}

// Function to get all available proteins
export function getAvailableProteins(): { id: string, name: string }[] {
  return proteinDatabase.map(protein => ({
    id: protein.id,
    name: protein.name
  }));
}

// Function to get a specific protein by ID
export function getProteinById(id: string): ProteinStructure | undefined {
  return proteinDatabase.find(protein => protein.id === id);
}

// Function to get all available species
export function getAvailableSpecies(): Species[] {
  const speciesSet = new Set<Species>();
  proteinDatabase.forEach(protein => {
    speciesSet.add(protein.species as Species);
  });
  return Array.from(speciesSet);
}

// Function to get proteins by species
export function getProteinsBySpecies(species: Species): { id: string, name: string }[] {
  return proteinDatabase
    .filter(protein => protein.species === species)
    .map(protein => ({
      id: protein.id,
      name: protein.name
    }));
}
