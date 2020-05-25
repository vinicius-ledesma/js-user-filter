const users = [];
const fetchUsers = async () => {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  users.push(
    ...json.results.map(({ name, gender, dob, picture }) => {
      return {
        name: name.first + " " + name.last,
        gender,
        picture: picture.thumbnail,
        age: dob.age,
      };
    })
  );
  render();
};
fetchUsers();

const filtUser = [];

const usrMsg = document.querySelector("#usr-msg");
const usrList = document.querySelector("#usr-list");
const statMsg = document.querySelector("#stat-msg");
const statList = document.querySelector("#stat-list");

window.addEventListener("load", () => {
  const busca = document.querySelector("#busca");
  const buscar = document.querySelector("#buscar");

  buscar.disabled = true;

  busca.addEventListener("keyup", handleKeyUp);
  busca.addEventListener("change", handleChange);
  buscar.addEventListener("click", doFilter);
});

const handleKeyUp = (e) => {
  if (e.target.value.length > 0) {
    buscar.disabled = false;
  } else {
    buscar.disabled = true;
  }
  if (e.keyCode == 13) {
    doFilter();
  }
};

const handleChange = (e) => {
  if (e.target.value.length > 0) {
    buscar.disabled = false;
  } else {
    buscar.disabled = true;
  }
};

const doFilter = () => {
  if (busca.value.length > 0) {
    filtUser.length = 0;
    filtUser.push(
      ...users
        .filter((usr) =>
          usr.name.toLowerCase().includes(busca.value.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    render();
  }
};

const render = () => {
  if (filtUser.length === 0) {
    usrMsg.innerHTML = "Nenhum usuário filtrado";
    statMsg.innerHTML = "Nada a ser exibido";
    usrList.innerHTML = "";
    statList.innerHTML = "";
  } else {
    usrMsg.innerHTML = `${filtUser.length} usuário${
      filtUser.length > 1 ? "s" : ""
    } encontrado${filtUser.length > 1 ? "s" : ""}`;
    statMsg.innerHTML = "Estatísticas";
    const { maleCount, femaleCount, ageCount } = filtUser.reduce(
      (cnt, usr) => {
        const aCnt = cnt.ageCount + usr.age;
        const mCnt =
          usr.gender.toLowerCase() === "male"
            ? cnt.maleCount + 1
            : cnt.maleCount;
        const fCnt =
          usr.gender.toLowerCase() === "female"
            ? cnt.femaleCount + 1
            : cnt.femaleCount;
        return {
          maleCount: mCnt,
          femaleCount: fCnt,
          ageCount: aCnt,
        };
      },
      {
        maleCount: 0,
        femaleCount: 0,
        ageCount: 0,
      }
    );
    const ageAvg = (ageCount / filtUser.length).toFixed(2);
    statList.innerHTML = `
      <li>
        Sexo masculino: <strong>${maleCount}</strong>
      </li>
      <li>
        Sexo feminino: <strong>${femaleCount}</strong>
      </li>
      <li>
        Soma das idades: <strong>${ageCount}</strong>
      </li>
      <li>
        Média das idades: <strong>${ageAvg}</strong>
      </li>
    `;
    usrList.innerHTML = "";
    filtUser.map(({ name, age, picture }) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img class="pic" src="${picture}">
        <span class="usr-data" >${name}, ${age} anos</span>
      `;
      usrList.appendChild(li);
    });
  }
};
