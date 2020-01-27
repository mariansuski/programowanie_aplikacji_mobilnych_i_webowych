class User:
    def __init__(self, firstname, lastname, password, birthdate, login, pesel, sex, token=None):
        self.firstname = firstname
        self.lastname = lastname
        self.password = password
        self.birthdate = birthdate
        self.login = login
        self.pesel = pesel
        self.sex = sex
        self.token = token

    def get_data(self):
        return {
            'first_name': self.firstname,
            'last_name': self.lastname,
            'password': self.password,
            'birth_date': self.birthdate,
            'login': self.login,
            'pesel': self.pesel,
            'sex': self.sex,
            'token': self.token,
        }

    def __str__(self):
        return self.login